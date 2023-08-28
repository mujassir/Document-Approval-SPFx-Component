import { IConfigItem } from "../../../common/IConfigItem";

export interface IApproveRejectFieldProps {
    objectType: string;
    fileRef: string;
    itemId: number;
    fieldValue: string;
    fieldName: string;
    siteURL: string;
    configuration: IConfigItem;
    context: any
    listItem: any;
  }