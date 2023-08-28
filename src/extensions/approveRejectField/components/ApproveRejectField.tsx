import { Log } from '@microsoft/sp-core-library';
import * as React from 'react';

import styles from './ApproveRejectField.module.scss';
import Dialog, { DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { SPFI, spfi, SPFx } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import "@pnp/sp/fields";

const FSObjectTypes = {
  Folder: '1',
  ListItem: '0'
};
const dialogContentProps = {
  type: DialogType.normal,
  title: 'Document Approval',
  closeButtonAriaLabel: 'Close',
  subText: 'Are you sure you want to approve or reject this document?',
};


export interface IApproveRejectFieldProps {
  objectType: string;
  fileRef: string;
  itemId: number;
  fieldValue: string;
  configList: any;
  context: any
}

const LOG_SOURCE: string = 'ApproveRejectField';

export default class ApproveRejectField extends React.Component<IApproveRejectFieldProps, {}> {
  public state = {
    approvalDialogHidden: true,
    ApprovalStatusValue: this.props.fieldValue,
  };

  private _sp: SPFI;
  constructor(props: IApproveRejectFieldProps) {
    super(props);
    this._sp = spfi().using(SPFx(this.props.context))
  }

  public componentDidMount(): void {
    Log.info(LOG_SOURCE, 'React Element: ApproveRejectField mounted');
  }

  public componentWillUnmount(): void {
    Log.info(LOG_SOURCE, 'React Element: ApproveRejectField unmounted');
  }

  public render(): React.ReactElement<{}> {
    return this.props.objectType == FSObjectTypes.ListItem ? this.renderField() : (<div></div>);
  }

  private renderField(): React.ReactElement<{}> {
    const config = this.props.configList
    const pageContext = this.props.context._pageContext._list
    const libraryConfig = config.filter((e: any) => e.DocumentLibraryName === pageContext.title)[0] || {};
    const folderName = this.getFolderName(this.props.fileRef)

    if (folderName !== libraryConfig.FolderName) {
      return (
        <div></div>
      );
    }
    const { ApprovalStatusValue } = this.state;
    return (
      ApprovalStatusValue == "Approved" || ApprovalStatusValue == "Rejected" ?
        (
          <div className={ApprovalStatusValue == "Approved" ? styles.approved : styles.rejected}>
            {ApprovalStatusValue}
          </div>
        ) : (

          <div>
            <PrimaryButton onClick={() => this.performAction_Click()} text="Perform Action" />
            {this.renderDialog()}
          </div>
        )
    );

  }

  private renderDialog(): React.ReactElement<{}> {
    return (
      <Dialog
        hidden={this.state.approvalDialogHidden}
        onDismiss={this.closeDialog}
        dialogContentProps={dialogContentProps}
      >
        <DialogFooter>
          <PrimaryButton onClick={() => this.approve_Click()} text="Approve" />
          <DefaultButton onClick={() => this.reject_Click()} text="Reject" className={styles.btnReject} />
          <DefaultButton onClick={() => this.closeDialog()} text="Cancel" />
        </DialogFooter>
      </Dialog>
    );

  }

  private getFolderName(path: string): string {
    const cleanUrl = path.replace(/\/+$/, '');
    const token = cleanUrl.split('/');
    return token[token.length - 2] || ""

  }
  private performAction_Click() {
    this.setState({ approvalDialogHidden: false });
  }

  private closeDialog() {
    this.setState({ approvalDialogHidden: true });
  }
  private approve_Click() {
    this._saveValue('Approved')
  }

  private reject_Click() {
    this._saveValue('Rejected')
  }

  private _saveValue = async (value: string): Promise<void> => {
    try {
      const list = this._sp.web.lists.getById(this.props.context.pageContext.list.id.toString());
      const item = list.items.getById(this.props.itemId);
      await item.update({ ApprovalStatus: value });
      this.setState({ ApprovalStatusValue: value });
      this.closeDialog();
    } catch (error) {
      console.error('Error updating list item:', error);
    }
  };


}
