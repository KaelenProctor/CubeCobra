const express = require('express');

const sortutil = require('../../client/utils/Sort');
const { cardCollectorNumber, cardName, cardSet } = require('../../client/utils/cardutil');
const filterutil = require('../../client/filtering/FilterCards');
const { cardFromId } = require('../../util/carddb');

const { isCubeViewable } = require('../../util/cubefn');
const { writeCard, CSV_HEADER, exportToMtgo } = require('./helper');
const { handleRouteError, redirect } = require('../../util/render');

// Bring in models
const Cube = require('../../dynamo/models/cube');

const router = express.Router();

const sortCardsByQuery = (req, cards) => {
  if (req.query.filter) {
    const { filter, err } = filterutil.makeFilter(req.query.filter);
    if (err) {
      throw err;
    }
    if (filter) {
      cards = cards.filter(filter);
    }
  }

  return sortutil.sortForDownload(
    cards,
    req.query.primary,
    req.query.secondary,
    req.query.tertiary,
    req.query.quaternary,
    req.query.showother === 'true', //Coerce string parameter to boolean
  );
};

router.get('/cubecobra/:id', async (req, res) => {
  try {
    const cube = await Cube.getById(req.params.id);
    if (!isCubeViewable(cube, req.user)) {
      req.flash('danger', `Cube ID ${req.params.id} not found/`);
      return redirect(req, res, '/404');
    }

    const cards = await Cube.getCards(cube.id);
    let { mainboard } = cards;

    for (const card of mainboard) {
      const details = cardFromId(card.cardID);
      card.details = details;
    }

    mainboard = sortCardsByQuery(req, mainboard);

    res.setHeader('Content-disposition', `attachment; filename=${cube.name.replace(/\W/g, '')}.txt`);
    res.setHeader('Content-type', 'text/plain');
    res.charset = 'UTF-8';
    for (const card of mainboard) {
      res.write(`${cardName(card)}\r\n`);
    }
    return res.end();
  } catch (err) {
    return handleRouteError(req, res, err, '/404');
  }
});

router.get('/csv/:id', async (req, res) => {
  try {
    const cube = await Cube.getById(req.params.id);

    if (!isCubeViewable(cube, req.user)) {
      req.flash('danger', `Cube ID ${req.params.id} not found/`);
      return redirect(req, res, '/404');
    }

    const cards = await Cube.getCards(cube.id);
    let { mainboard } = cards;
    const { maybeboard } = cards;

    for (const card of [...mainboard, ...maybeboard]) {
      const details = cardFromId(card.cardID);
      card.details = details;
    }

    mainboard = sortCardsByQuery(req, mainboard);

    res.setHeader('Content-disposition', `attachment; filename=${cube.name.replace(/\W/g, '')}.csv`);
    res.setHeader('Content-type', 'text/plain');
    res.charset = 'UTF-8';
    res.write(`${CSV_HEADER}\r\n`);

    for (const card of mainboard) {
      writeCard(res, card, false);
    }
    for (const card of maybeboard) {
      writeCard(res, card, true);
    }

    return res.end();
  } catch (err) {
    return handleRouteError(req, res, err, '/404');
  }
});

router.get('/forge/:id', async (req, res) => {
  try {
    const cube = await Cube.getById(req.params.id);

    if (!isCubeViewable(cube, req.user)) {
      req.flash('danger', `Cube ID ${req.params.id} not found/`);
      return redirect(req, res, '/404');
    }

    const cards = await Cube.getCards(cube.id);
    let { mainboard } = cards;

    for (const card of mainboard) {
      const details = cardFromId(card.cardID);
      card.details = details;
    }

    mainboard = sortCardsByQuery(req, mainboard);

    res.setHeader('Content-disposition', `attachment; filename=${cube.name.replace(/\W/g, '')}.dck`);
    res.setHeader('Content-type', 'text/plain');
    res.charset = 'UTF-8';
    res.write('[metadata]\r\n');
    res.write(`name=${cube.name}\r\n`);
    res.write('[Main]\r\n');
    for (const card of mainboard) {
      res.write(`1 ${cardName(card)}|${cardSet(card).toUpperCase()}\r\n`);
    }
    return res.end();
  } catch (err) {
    return handleRouteError(req, res, err, '/404');
  }
});

router.get('/mtgo/:id', async (req, res) => {
  try {
    const cube = await Cube.getById(req.params.id);

    if (!isCubeViewable(cube, req.user)) {
      req.flash('danger', `Cube ID ${req.params.id} not found/`);
      return redirect(req, res, '/404');
    }

    const cards = await Cube.getCards(cube.id);
    let { mainboard } = cards;
    const { maybeboard } = cards;

    for (const card of mainboard) {
      const details = cardFromId(card.cardID);
      card.details = details;
    }

    mainboard = sortCardsByQuery(req, mainboard);

    return exportToMtgo(res, cube.name, mainboard, maybeboard);
  } catch (err) {
    return handleRouteError(req, res, err, '/404');
  }
});

router.get('/xmage/:id', async (req, res) => {
  try {
    const cube = await Cube.getById(req.params.id);

    if (!isCubeViewable(cube, req.user)) {
      req.flash('danger', `Cube ID ${req.params.id} not found/`);
      return redirect(req, res, '/404');
    }

    const cards = await Cube.getCards(cube.id);
    let { mainboard } = cards;

    for (const card of mainboard) {
      const details = cardFromId(card.cardID);
      card.details = details;
    }

    mainboard = sortCardsByQuery(req, mainboard);

    res.setHeader('Content-disposition', `attachment; filename=${cube.name.replace(/\W/g, '')}.dck`);
    res.setHeader('Content-type', 'text/plain');
    res.charset = 'UTF-8';
    for (const card of mainboard) {
      res.write(`1 [${cardSet(card).toUpperCase()}:${cardCollectorNumber(card)}] ${cardName(card)}\r\n`);
    }
    return res.end();
  } catch (err) {
    return handleRouteError(req, res, err, '/404');
  }
});

router.get('/plaintext/:id', async (req, res) => {
  try {
    const cube = await Cube.getById(req.params.id);

    if (!isCubeViewable(cube, req.user)) {
      req.flash('danger', `Cube ID ${req.params.id} not found/`);
      return redirect(req, res, '/404');
    }

    const cards = await Cube.getCards(cube.id);

    res.setHeader('Content-disposition', `attachment; filename=${cube.name.replace(/\W/g, '')}.txt`);
    res.setHeader('Content-type', 'text/plain');
    res.charset = 'UTF-8';

    for (const [boardname, list] of Object.entries(cards)) {
      if (boardname !== 'id') {
        for (const card of list) {
          const details = cardFromId(card.cardID);
          card.details = details;
        }
        const sorted = sortCardsByQuery(req, list);

        res.write(`# ${boardname}\r\n`);
        for (const card of sorted) {
          res.write(`${cardName(card)}\r\n`);
        }
        res.write(`\r\n`);
      }
    }

    return res.end();
  } catch (err) {
    return handleRouteError(req, res, err, '/404');
  }
});

module.exports = router;
