import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Log } from '@microsoft/sp-core-library';

import {
  BaseFieldCustomizer,
  IFieldCustomizerCellEventParameters
} from '@microsoft/sp-listview-extensibility';

import * as strings from 'ApproveRejectFieldFieldCustomizerStrings';
import { IConfigItem } from '../../common/IConfigItem';
import ApproveRejectField from './components/ApproveRejectField';
import { IApproveRejectFieldProps } from './components/IApproveRejectFieldProps';

/**
 * If your field customizer uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IApproveRejectFieldFieldCustomizerProperties {
  // This is an example; replace with your own property
  sampleText?: string;
  configList: any[];
}

const CONFIG_LIST_TITLE = 'Document Approval Configuration';
const LOG_SOURCE: string = 'ApproveRejectFieldFieldCustomizer';

export default class ApproveRejectFieldFieldCustomizer
  extends BaseFieldCustomizer<IApproveRejectFieldFieldCustomizerProperties> {

  public async onInit(): Promise<void> {
    this.properties.configList = await this._getConfigData(CONFIG_LIST_TITLE);

    // Add your custom initialization to this method.  The framework will wait
    // for the returned promise to resolve before firing any BaseFieldCustomizer events.
    Log.info(LOG_SOURCE, 'Activated ApproveRejectFieldFieldCustomizer with properties:');
    Log.info(LOG_SOURCE, JSON.stringify(this.properties, undefined, 2));
    Log.info(LOG_SOURCE, `The following string should be equal: "ApproveRejectFieldFieldCustomizer" and "${strings.Title}"`);
    return Promise.resolve();
  }

  public onRenderCell(event: IFieldCustomizerCellEventParameters): void {
    // Use this method to perform your custom cell rendering.
    const fileRef = event.listItem.getValueByName("FileRef");
    const objectType = event.listItem.getValueByName("FSObjType");
    const listItemId = event.listItem.getValueByName("ID");
    const FileName = event.listItem.getValueByName("FileLeafRef");
    const libraryName = this.getLibraryName(fileRef);
    const configData: IConfigItem = this.properties.configList.filter((e: IConfigItem) => e.DocumentLibraryName === libraryName)[0] || { FolderName: '', DrillDownLevel: 0, DocumentLibraryName: '' };

    const creatorField = event.listItem.getValueByName("Author");

    const approveRejectField: React.ReactElement<{}> =
      React.createElement(ApproveRejectField, {
        objectType,
        itemId: listItemId,
        fileRef: fileRef,
        FileName: FileName,
        fieldValue: event.fieldValue,
        fieldName: this.context.field.internalName,
        configuration: configData,
        context: this.context,
        listItem: event.listItem,
        siteURL: this.context.pageContext.site.absoluteUrl,
        creator: creatorField[0] || {},
      } as IApproveRejectFieldProps);

    ReactDOM.render(approveRejectField, event.domElement);
  }

  public onDisposeCell(event: IFieldCustomizerCellEventParameters): void {
    // This method should be used to free any resources that were allocated during rendering.
    // For example, if your onRenderCell() called ReactDOM.render(), then you should
    // call ReactDOM.unmountComponentAtNode() here.
    ReactDOM.unmountComponentAtNode(event.domElement);
    super.onDisposeCell(event);
  }

  private getLibraryName(path: string): string {
    if (path.indexOf("/sites/") > -1) {
      // subsite
      const cleanUrl = path.replace(/\/+$/, '');
      const tokens = cleanUrl.split('/');
      return tokens[3];
    }
    else {
      // root site
      const cleanUrl = path.replace(/\/+$/, '');
      const tokens = cleanUrl.split('/');
      return tokens[1];
    }
  }

  private async _getConfigData(configListTitle: string): Promise<any[]> {

    // Create a unique key for the session storage based on the list title and library name.
    const storageKey = `configData-${configListTitle}`;

    // Check if data is already in session storage
    const storedData = sessionStorage.getItem(storageKey);

    if (storedData) {
      return JSON.parse(storedData);
    }

    // If data isn't in session storage, fetch it
    const url = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${configListTitle}')/items`;
    const response: Response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json;odata=nometadata',
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    const configList = data?.value || [];

    // Store the fetched data in session storage for future use
    sessionStorage.setItem(storageKey, JSON.stringify(configList));

    return configList;
  }
}
