import { describe, test, expect } from 'vitest';
import {
  VALID_FILTERS_CONFIG_DIR,
  SNAPSHOTS_DIR,
  MOCKS_DIR
} from '../../config/constants';
import { YamlConfigParser } from '../../../src/helperModules/YamlConfigParser';
import fs from 'fs';

const INVALID_FILTER_MOCKS_DIR = `${MOCKS_DIR}/invalid/filtersConfigDirs`;

describe('YamlConfigParser', () => {
  const LANG_DIR = `${VALID_FILTERS_CONFIG_DIR}/en`;
  test('loads filter options from a directory', () => {
    const glossary = YamlConfigParser.loadGlossaryFromLangDir(LANG_DIR);
    const filterOptionsConfig = YamlConfigParser.loadFiltersConfigFromLangDir({
      dir: LANG_DIR,
      glossary
    });
    expect(JSON.stringify(filterOptionsConfig, null, 2)).toMatchFileSnapshot(
      `${SNAPSHOTS_DIR}/helperModules/YamlConfigParser/valid/ingestedFilterOptions.snap.json`
    );
  });

  const invalidDirs = fs.readdirSync(INVALID_FILTER_MOCKS_DIR);

  invalidDirs.forEach((invalidDir) => {
    test(`throws an error when processing the '${invalidDir}' directory`, () => {
      expect(() => {
        const glossary = YamlConfigParser.loadGlossaryFromLangDir(invalidDir);
        YamlConfigParser.loadFiltersConfigFromLangDir({
          dir: `${INVALID_FILTER_MOCKS_DIR}/${invalidDir}`,
          glossary
        });
      }).toThrow();
    });

    test(`throws an error that matches the snapshot for the '${invalidDir}' directory`, () => {
      try {
        const glossary = YamlConfigParser.loadGlossaryFromLangDir(invalidDir);
        YamlConfigParser.loadFiltersConfigFromLangDir({
          dir: `${INVALID_FILTER_MOCKS_DIR}/${invalidDir}`,
          glossary
        });
      } catch (error) {
        const sanitizedErrorMessage = error.message.replace(INVALID_FILTER_MOCKS_DIR, '');
        expect(sanitizedErrorMessage).toMatchFileSnapshot(
          `${SNAPSHOTS_DIR}/helperModules/YamlConfigParser/invalid/ingestedFiltersConfig/${invalidDir}.snap.txt`
        );
      }
    });
  });
});
