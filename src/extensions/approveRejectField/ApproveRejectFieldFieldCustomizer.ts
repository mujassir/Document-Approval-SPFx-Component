import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Log } from '@microsoft/sp-core-library';

import {
  BaseFieldCustomizer,
  IFieldCustomizerCellEventParameters
} from '@microsoft/sp-listview-extensibility';

import * as strings from 'ApproveRejectFieldFieldCustomizerStrings';
import ApproveRejectField, { IApproveRejectFieldProps } from './components/ApproveRejectField';

/**
 * If your field customizer uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IApproveRejectFieldFieldCustomizerProperties {
  // This is an example; replace with your own property
  sampleText?: string;
}

const LOG_SOURCE: string = 'ApproveRejectFieldFieldCustomizer';

export default class ApproveRejectFieldFieldCustomizer
  extends BaseFieldCustomizer<IApproveRejectFieldFieldCustomizerProperties> {

  public onInit(): Promise<void> {
    // Add your custom initialization to this method.  The framework will wait
    // for the returned promise to resolve before firing any BaseFieldCustomizer events.
    Log.info(LOG_SOURCE, 'Activated ApproveRejectFieldFieldCustomizer with properties:');
    Log.info(LOG_SOURCE, JSON.stringify(this.properties, undefined, 2));
    Log.info(LOG_SOURCE, `The following string should be equal: "ApproveRejectFieldFieldCustomizer" and "${strings.Title}"`);
    return Promise.resolve();
  }

  public onRenderCell(event: IFieldCustomizerCellEventParameters): void {
    // Use this method to perform your custom cell rendering.
    console.log("listItem: ", event.listItem);
    console.log("Userdata: ", event.userData);
    const objectType = event.listItem.getValueByName("FSObjType");
    const listItemId = event.listItem.getValueByName("ID");
    const approveRejectField: React.ReactElement<{}> =
      React.createElement(ApproveRejectField, { objectType, itemId: listItemId, fieldValue: event.fieldValue } as IApproveRejectFieldProps);

    ReactDOM.render(approveRejectField, event.domElement);
  }

  public onDisposeCell(event: IFieldCustomizerCellEventParameters): void {
    // This method should be used to free any resources that were allocated during rendering.
    // For example, if your onRenderCell() called ReactDOM.render(), then you should
    // call ReactDOM.unmountComponentAtNode() here.
    ReactDOM.unmountComponentAtNode(event.domElement);
    super.onDisposeCell(event);
  }
}
