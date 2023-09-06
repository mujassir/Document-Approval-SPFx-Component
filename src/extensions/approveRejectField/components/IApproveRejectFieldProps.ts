import { IConfigItem } from "../../../common/IConfigItem";

export interface IApproveRejectFieldProps {
    objectType: string;
    fileRef: string;
    FileName: string;
    itemId: number;
    fieldValue: string;
    fieldName: string;
    siteURL: string;
    configuration: IConfigItem;
    context: any
    listItem: any;
    creator: {
      title: string;
      email: string;
    }
  }