import { JBDictionary } from "jb-core/i18n";

export type JBModalDictionary = {
  dialog: string;
};

export const dictionary = new JBDictionary<JBModalDictionary>({
  fa: { dialog: "کادر محاوره" },
  en: { dialog: "Dialog" },
});
