import P1P1Pack from '../../../src/datatypes/P1P1Pack';
import Cube from '../../../src/dynamo/models/cube';
import p1p1PackModel from '../../../src/dynamo/models/p1p1Pack';
import { getP1P1Handler } from '../../../src/router/routes/tool/api/getp1p1';
import { createCube, createUser } from '../../test-utils/data';
import { call } from '../../test-utils/transport';

const uuid = jest.requireActual('uuid');

jest.mock('../../../src/dynamo/models/p1p1Pack', () => ({
  ...jest.requireActual('../../../src/dynamo/models/p1p1Pack'),
  getById: jest.fn(),
  getVoteSummary: jest.fn(),
}));

jest.mock('../../../src/dynamo/models/cube', () => ({
  ...jest.requireActual('../../../src/dynamo/models/cube'),
  getById: jest.fn(),
}));

const createP1P1Pack = (overrides?: Partial<P1P1Pack>): P1P1Pack => ({
  id: uuid.v4(),
  cubeId: uuid.v4(),
  cards: [
    { oracle_id: 'oracle-1', name: 'Test Card 1' } as any,
    { oracle_id: 'oracle-2', name: 'Test Card 2' } as any,
    { oracle_id: 'oracle-3', name: 'Test Card 3' } as any
  ],
  seed: 'test-seed',
  date: Date.now(),
  createdBy: 'test-user',
  createdByUsername: 'testuser',
  votes: [],
  botPick: 0,
  botWeights: [0.8, 0.6, 0.4],
  ...overrides,
});

describe('Get P1P1 Pack API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 404 if pack is not found', async () => {
    const packId = uuid.v4();
    (p1p1PackModel.getById as jest.Mock).mockResolvedValue(undefined);

    const res = await call(getP1P1Handler).withParams({ packId }).send();

    expect(p1p1PackModel.getById).toHaveBeenCalledWith(packId);
    expect(res.status).toEqual(404);
    expect(res.body).toEqual({
      error: 'P1P1 pack not found',
    });
  });

  it('should return 404 when cube is not found (undefined)', async () => {
    const packId = uuid.v4();
    const pack = createP1P1Pack({ id: packId });

    (p1p1PackModel.getById as jest.Mock).mockResolvedValue(pack);
    (Cube.getById as jest.Mock).mockResolvedValue(undefined);

    const res = await call(getP1P1Handler).withParams({ packId }).send();

    expect(p1p1PackModel.getById).toHaveBeenCalledWith(packId);
    expect(Cube.getById).toHaveBeenCalledWith(pack.cubeId);
    expect(res.status).toEqual(404);
    expect(res.body).toEqual({
      error: 'Associated cube not found',
    });
  });

  it('should return pack with cube info when cube is found', async () => {
    const packId = uuid.v4();
    const pack = createP1P1Pack({ id: packId });
    const cube = createCube({ 
      id: pack.cubeId, 
      name: 'Test Cube',
      owner: createUser({ username: 'testowner' })
    });
    const voteSummary = {
      totalVotes: 5,
      results: [
        { cardIndex: 0, voteCount: 3, percentage: 60 },
        { cardIndex: 1, voteCount: 2, percentage: 40 },
        { cardIndex: 2, voteCount: 0, percentage: 0 },
      ],
      userVote: 0,
      botPick: 0,
      botWeights: [0.8, 0.6, 0.4],
    };

    (p1p1PackModel.getById as jest.Mock).mockResolvedValue(pack);
    (Cube.getById as jest.Mock).mockResolvedValue(cube);
    (p1p1PackModel.getVoteSummary as jest.Mock).mockReturnValue(voteSummary);

    const user = createUser();
    const res = await call(getP1P1Handler).as(user).withParams({ packId }).send();

    expect(p1p1PackModel.getById).toHaveBeenCalledWith(packId);
    expect(Cube.getById).toHaveBeenCalledWith(pack.cubeId);
    expect(p1p1PackModel.getVoteSummary).toHaveBeenCalledWith(pack, user.id);
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      success: true,
      pack,
      cube: {
        name: 'Test Cube',
        owner: 'testowner',
      },
      votes: voteSummary,
    });
  });

  it('should handle cube fetch error gracefully', async () => {
    const packId = uuid.v4();
    const pack = createP1P1Pack({ id: packId });
    const voteSummary = {
      totalVotes: 0,
      results: [],
      userVote: undefined,
      botPick: 0,
      botWeights: [0.8, 0.6, 0.4],
    };

    (p1p1PackModel.getById as jest.Mock).mockResolvedValue(pack);
    (Cube.getById as jest.Mock).mockRejectedValue(new Error('Database error'));
    (p1p1PackModel.getVoteSummary as jest.Mock).mockReturnValue(voteSummary);

    const res = await call(getP1P1Handler).withParams({ packId }).send();

    expect(res.status).toEqual(500);
    expect(res.body).toEqual({
      error: 'Error fetching P1P1 pack',
    });
  });

  it('should return 500 on unexpected error', async () => {
    const packId = uuid.v4();
    (p1p1PackModel.getById as jest.Mock).mockRejectedValue(new Error('Database error'));

    const res = await call(getP1P1Handler).withParams({ packId }).send();

    expect(res.status).toEqual(500);
    expect(res.body).toEqual({
      error: 'Error fetching P1P1 pack',
    });
  });
});
