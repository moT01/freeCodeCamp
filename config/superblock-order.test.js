"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const all_langs_1 = require("./i18n/all-langs");
const certification_settings_1 = require("./certification-settings");
const superblock_order_1 = require("./superblock-order");
const languages = Object.values(all_langs_1.Languages);
const superBlocks = Object.values(certification_settings_1.SuperBlocks);
const curriculumMaps = Object.values(superblock_order_1.CurriculumMaps);
const translationStates = Object.values(superblock_order_1.TranslationStates);
const superBlockStates = Object.values(superblock_order_1.SuperBlockStates);
const superBlockOrderLanguages = Object.keys(superblock_order_1.superBlockOrder);
describe("'defaultSuperBlockOrder'", () => {
    it("should have a matching item for each value in the 'SuperBlocks' object", () => {
        superBlocks.forEach(superBlock => {
            expect(superblock_order_1.defaultSuperBlockOrder).toContain(superBlock);
        });
    });
    it('should not have any extra keys', () => {
        expect(superblock_order_1.defaultSuperBlockOrder.length).toEqual(superBlocks.length);
    });
});
describe("'superBlockOrder'", () => {
    it("should have a matching key for each value in the 'Languages' object", () => {
        languages.forEach(language => {
            expect(superblock_order_1.superBlockOrder).toHaveProperty(language);
        });
    });
    it('should not have any extra keys', () => {
        expect(superBlockOrderLanguages.length).toEqual(languages.length);
    });
    superBlockOrderLanguages.forEach(language => {
        describe(`'${language}'`, () => {
            // e.g. ['landing', 'learn']
            const languageMaps = Object.keys(superblock_order_1.superBlockOrder[language]);
            it("should have a matching key for each value in the 'CurriculumMaps' object", () => {
                curriculumMaps.forEach(curriculumMap => {
                    expect(languageMaps).toContain(curriculumMap);
                });
            });
            it('should not have any extra keys', () => {
                expect(languageMaps.length).toEqual(curriculumMaps.length);
            });
            describe("'landing'", () => {
                const landingSuperBlocks = superblock_order_1.superBlockOrder[language][superblock_order_1.CurriculumMaps.Landing];
                it(`should have ${superblock_order_1.numberOfSuperBlocksOnLanding} items (superBlocks)`, () => {
                    expect(landingSuperBlocks.length).toEqual(superblock_order_1.numberOfSuperBlocksOnLanding);
                });
                it("should only have items that are in 'SuperBlocks' object", () => {
                    landingSuperBlocks.forEach(superBlock => {
                        expect(superBlocks).toContain(superBlock);
                    });
                });
                it('should not have a superBlock out of order', () => {
                    landingSuperBlocks.forEach((superBlock, index) => {
                        const defaultIndex = superblock_order_1.defaultSuperBlockOrder.indexOf(superBlock);
                        const defaultSbsAfterCurrentSb = superblock_order_1.defaultSuperBlockOrder.slice(defaultIndex + 1);
                        for (let j = index + 1; j < landingSuperBlocks.length; j++) {
                            expect(defaultSbsAfterCurrentSb).toContain(landingSuperBlocks[j]);
                        }
                    });
                });
            });
            describe("'learn'", () => {
                const learn = superblock_order_1.superBlockOrder[language][superblock_order_1.CurriculumMaps.Learn];
                const learnKeys = Object.keys(learn);
                it("should have a matching key for each value in the 'TranslationStates' object", () => {
                    translationStates.forEach(translationState => {
                        expect(learnKeys).toContain(translationState);
                    });
                });
                it('should not have any extra keys', () => {
                    expect(learnKeys.length).toEqual(translationStates.length);
                });
                const audited = superblock_order_1.superBlockOrder[language][superblock_order_1.CurriculumMaps.Learn][superblock_order_1.TranslationStates.Audited];
                const auditedKeys = Object.keys(audited);
                const notAudited = superblock_order_1.superBlockOrder[language][superblock_order_1.CurriculumMaps.Learn][superblock_order_1.TranslationStates.NotAudited];
                const notAuditedKeys = Object.keys(notAudited);
                describe("'audited'", () => {
                    it("should have a matching key for each value in the 'SuperBlockStates' object", () => {
                        superBlockStates.forEach(superBlockState => {
                            expect(auditedKeys).toContain(superBlockState);
                        });
                    });
                    it('should not have any extra keys', () => {
                        expect(auditedKeys.length).toEqual(superBlockStates.length);
                    });
                    superBlockStates.forEach(superBlockState => {
                        const stateSuperBlocks = audited[superBlockState];
                        describe(`'${superBlockState}'`, () => {
                            it('should not have a superBlock out of order', () => {
                                stateSuperBlocks.forEach((superBlock, index) => {
                                    const defaultIndex = superblock_order_1.defaultSuperBlockOrder.indexOf(superBlock);
                                    const defaultSbsAfterCurrentSb = superblock_order_1.defaultSuperBlockOrder.slice(defaultIndex + 1);
                                    for (let j = index + 1; j < stateSuperBlocks.length; j++) {
                                        expect(defaultSbsAfterCurrentSb).toContain(stateSuperBlocks[j]);
                                    }
                                });
                            });
                        });
                    });
                });
                describe('not audited', () => {
                    it("should have a matching key for each value in the 'SuperBlockStates' object", () => {
                        superBlockStates.forEach(superBlockState => {
                            expect(notAuditedKeys).toContain(superBlockState);
                        });
                    });
                    it('should not have any extra keys', () => {
                        expect(notAuditedKeys.length).toEqual(superBlockStates.length);
                    });
                    superBlockStates.forEach(superBlockState => {
                        const stateSuperBlocks = notAudited[superBlockState];
                        describe(`'${superBlockState}'`, () => {
                            it('should not have a superBlock out of order', () => {
                                stateSuperBlocks.forEach((superBlock, index) => {
                                    const defaultIndex = superblock_order_1.defaultSuperBlockOrder.indexOf(superBlock);
                                    const defaultSbsAfterCurrentSb = superblock_order_1.defaultSuperBlockOrder.slice(defaultIndex + 1);
                                    for (let j = index + 1; j < stateSuperBlocks.length; j++) {
                                        expect(defaultSbsAfterCurrentSb).toContain(stateSuperBlocks[j]);
                                    }
                                });
                            });
                        });
                    });
                });
                it("should have exactly one of each 'SuperBlocks' among it's children", () => {
                    // flatten all ${language}.learn superblocks into one array
                    const learnSuperBlocks = [];
                    translationStates.forEach(translationState => {
                        superBlockStates.forEach(superBlockState => {
                            learnSuperBlocks.push(...learn[translationState][superBlockState]);
                        });
                    });
                    superBlocks.forEach(superBlock => {
                        expect(learnSuperBlocks).toContain(superBlock);
                    });
                });
            });
        });
    });
});
describe("'superBlockOrder' helper functions", () => {
    it("'getLearnSuperBlocks('english')' should return the correct array", () => {
        const learnSuperBlocks = (0, superblock_order_1.getLearnSuperBlocks)({
            language: 'english',
            showNewCurriculum: 'true',
            showUpcomingChanges: 'true'
        });
        const test = [
            certification_settings_1.SuperBlocks.RespWebDesignNew,
            certification_settings_1.SuperBlocks.JsAlgoDataStruct,
            certification_settings_1.SuperBlocks.FrontEndDevLibs,
            certification_settings_1.SuperBlocks.DataVis,
            certification_settings_1.SuperBlocks.RelationalDb,
            certification_settings_1.SuperBlocks.BackEndDevApis,
            certification_settings_1.SuperBlocks.QualityAssurance,
            certification_settings_1.SuperBlocks.SciCompPy,
            certification_settings_1.SuperBlocks.DataAnalysisPy,
            certification_settings_1.SuperBlocks.InfoSec,
            certification_settings_1.SuperBlocks.MachineLearningPy,
            certification_settings_1.SuperBlocks.CodingInterviewPrep,
            certification_settings_1.SuperBlocks.JsAlgoDataStructNew,
            certification_settings_1.SuperBlocks.RespWebDesign
        ];
        expect(learnSuperBlocks).toStrictEqual(test);
        expect(learnSuperBlocks.length).toEqual(test.length);
    });
    it("'getAuditedSuperBlocks('german')' should return the correct array", () => {
        const auditedSuperBlocks = (0, superblock_order_1.getAuditedSuperBlocks)({
            language: 'german',
            showNewCurriculum: 'true',
            showUpcomingChanges: 'true'
        });
        const test = [
            certification_settings_1.SuperBlocks.RespWebDesign,
            certification_settings_1.SuperBlocks.JsAlgoDataStruct,
            certification_settings_1.SuperBlocks.FrontEndDevLibs
        ];
        expect(auditedSuperBlocks).toStrictEqual(test);
        expect(auditedSuperBlocks.length).toEqual(test.length);
    });
    it("'getNotAuditedSuperBlocks('german')' should return the correct array", () => {
        const notAuditedSuperBlocks = (0, superblock_order_1.getNotAuditedSuperBlocks)({
            language: 'german',
            showNewCurriculum: 'true',
            showUpcomingChanges: 'true'
        });
        const test = [
            certification_settings_1.SuperBlocks.RespWebDesignNew,
            certification_settings_1.SuperBlocks.DataVis,
            certification_settings_1.SuperBlocks.RelationalDb,
            certification_settings_1.SuperBlocks.BackEndDevApis,
            certification_settings_1.SuperBlocks.QualityAssurance,
            certification_settings_1.SuperBlocks.SciCompPy,
            certification_settings_1.SuperBlocks.DataAnalysisPy,
            certification_settings_1.SuperBlocks.InfoSec,
            certification_settings_1.SuperBlocks.MachineLearningPy,
            certification_settings_1.SuperBlocks.CodingInterviewPrep,
            certification_settings_1.SuperBlocks.JsAlgoDataStructNew
        ];
        expect(notAuditedSuperBlocks).toStrictEqual(test);
        expect(notAuditedSuperBlocks.length).toEqual(test.length);
    });
});
