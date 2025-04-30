import React, { useContext, useMemo, useState } from 'react';

import { DefaultPrintingPreference, PrintingPreference } from '../../../datatypes/Card';
import { DefaultGridTightnessPreference, GridTightnessPreference } from '../../../datatypes/User';
import UserContext from '../../contexts/UserContext';
import Button from '../base/Button';
import Checkbox from '../base/Checkbox';
import { Flexbox } from '../base/Layout';
import Select from '../base/Select';
import CSRFForm from '../CSRFForm';

const UserThemeForm: React.FC = () => {
  const user = useContext(UserContext);
  const [selectedTheme, setSelectedTheme] = useState(user?.theme || 'default');
  const [defaultPrinting, setDefaultPrinting] = useState(user?.defaultPrinting || DefaultPrintingPreference);
  const [gridTightness, setGridTightness] = useState(user?.gridTightness || DefaultGridTightnessPreference);
  const [autoBlog, setAutoblog] = useState(typeof user?.autoBlog !== 'undefined' ? user.autoBlog : false);
  const [hideFeaturedCubes, setHideFeaturedCubes] = useState(user?.hideFeatured || false);
  const formRef = React.useRef<HTMLFormElement>(null);
  const formData = useMemo(
    () => ({
      theme: selectedTheme,
      hideFeatured: `${hideFeaturedCubes}`,
      defaultPrinting,
      gridTightness,
      autoBlog: `${autoBlog}`,
    }),
    [selectedTheme, hideFeaturedCubes, defaultPrinting, gridTightness, autoBlog],
  );

  return (
    <CSRFForm method="POST" action="/user/changedisplay" ref={formRef} formData={formData}>
      <Flexbox direction="col" gap="2">
        <Select
          label="Theme"
          id="theme"
          value={selectedTheme}
          setValue={(value) => setSelectedTheme(value)}
          options={[
            { value: 'default', label: 'Default' },
            { value: 'dark', label: 'Dark' },
          ]}
        />
        <Select
          label="Default Printing (this applies when searching cards outside a cube)"
          value={formData.defaultPrinting}
          setValue={(value) => setDefaultPrinting(value as PrintingPreference)}
          options={[
            { value: PrintingPreference.RECENT, label: 'Most Recent' },
            { value: PrintingPreference.FIRST, label: 'First' },
          ]}
        />
        <Select
          label="Default grid tightness"
          value={formData.gridTightness}
          setValue={(value) => setGridTightness(value as GridTightnessPreference)}
          options={[
            { value: GridTightnessPreference.LOOSE, label: 'Loose' },
            { value: GridTightnessPreference.TIGHT, label: 'Tight (no space)' },
          ]}
        />
        <Checkbox label="Hide featured cubes" checked={hideFeaturedCubes} setChecked={setHideFeaturedCubes} />
        <Checkbox
          label="Check 'Create Blog posts' for cube change by default"
          checked={autoBlog}
          setChecked={setAutoblog}
        />
        <Button block color="accent" onClick={() => formRef.current?.submit()}>
          Update
        </Button>
      </Flexbox>
    </CSRFForm>
  );
};

export default UserThemeForm;
