import { Log } from '@microsoft/sp-core-library';
import * as React from 'react';

import styles from './ApproveRejectField.module.scss';
import Dialog, { DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react';
import { SPFI, spfi, SPFx } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import "@pnp/sp/fields";
import { IApproveRejectFieldProps } from './IApproveRejectFieldProps';

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

const rejectRemarksDialogContentProps = {
  type: DialogType.normal,
  title: 'Document Reject Remarks',
  closeButtonAriaLabel: 'Close',
};

interface IApproveRejectState {
  ApprovalStatusValue: any; // Replace any with the appropriate type if known
  approvalDialogHidden: boolean;
  rejectRemarksDialogHidden: boolean;
  rejectRemarksField: string;
}
const LOG_SOURCE: string = 'ApproveRejectField';

export default class ApproveRejectField extends React.Component<IApproveRejectFieldProps, {}> {
  public state: IApproveRejectState = {
    ApprovalStatusValue: this.props.fieldValue,
    approvalDialogHidden: true,
    rejectRemarksDialogHidden: true,
    rejectRemarksField: ''
  };
  private _sp: SPFI;
  constructor(props: IApproveRejectFieldProps) {
    super(props);
    this._sp = spfi().using(SPFx(this.props.context))
  }

  public componentDidMount() { }

  public componentWillUnmount(): void {
    Log.info(LOG_SOURCE, 'React Element: ApproveRejectField unmounted');
  }

  public render(): React.ReactElement<{}> {
    return this.props.objectType == FSObjectTypes.ListItem ? this.renderField() : (<div></div>);
  }

  private renderField(): React.ReactElement<{}> {
    const folderFullName = this.getFolderStructure(this.props.fileRef);
    var drillDownLevel = this.getDrillDownLevel(this.props.fileRef);
    if (folderFullName == this.props.configuration.FolderName || drillDownLevel >= this.props.configuration.DrillDownLevel) {
      return this.renderUI()
    }
    return (
      <div></div>
    );
  }

  private renderUI(): React.ReactElement<{}> {
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
            {this.renderRejectRemarksDialog()}
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
  private renderRejectRemarksDialog(): React.ReactElement<{}> {
    return (
      <Dialog
        hidden={this.state.rejectRemarksDialogHidden}
        onDismiss={this.closeRemarksDialog}
        dialogContentProps={rejectRemarksDialogContentProps}
      >
        <TextField
          label="Enter your remarks..."
          required={true}
          multiline
          rows={5}
          value={this.state.rejectRemarksField}
          onChange={(event, val) => this.setState({ rejectRemarksField: val })}
        />
        <DialogFooter>
          <DefaultButton onClick={() => this.rejectRemarks_Click()} text="Reject" className={styles.btnReject} />
          <DefaultButton onClick={() => this.closeRemarksDialog()} text="Cancel" />
        </DialogFooter>
      </Dialog>
    );

  }
  private performAction_Click() {
    this.setState({ approvalDialogHidden: false });
  }

  private closeDialog() {
    this.setState({ approvalDialogHidden: true });
  }
  private closeRemarksDialog() {
    this.setState({ rejectRemarksDialogHidden: true });
  }
  private approve_Click() {
    this._saveValue({ [this.props.fieldName]: 'Approved' })
    this.setState({ ApprovalStatusValue: 'Approved' })
  }
  private reject_Click() {
    this.closeDialog();
    this.setState({ rejectRemarksDialogHidden: false });
  }
  private async rejectRemarks_Click() {
    // const payload = {
    //   LibraryName: this.props.configuration.DocumentLibraryName,
    //   FileName: this.props.FileName,
    //   FileURL: this.props.fileRef,
    //   CreatorName: this.props.creator.title,
    //   CreatorEmail: this.props.creator.email,
    //   EditByName: this.props.context.pageContext.user.displayName,
    //   EditByEmail: this.props.context.pageContext.user.email,
    //   SiteTitle: this.props.context.pageContext.web.absoluteUrl,
    //   RejectRemarks: this.state.rejectRemarksField,
    //   ApprovalStatus: "Rejected",
    // }
    // this.postDataToApi(this.props.configuration.EmailEndpoint, payload);
    const pyaload = {
      [this.props.fieldName]: 'Rejected',
      ItemDescription: this.state.rejectRemarksField
    }
    const res = await this._saveValue(pyaload)
    if (res) {
      this.setState({ ApprovalStatusValue: 'Rejected' })
      this.setState({ ItemDescription: this.state.rejectRemarksField })
      location.reload();
    }
  }


  private getFolderStructure(path: string): string {
    if (path.indexOf("/sites/") > -1) {
      const withoutFileName = path.substring(0, path.lastIndexOf('/'));
      const tokens = withoutFileName.split('/');
      return tokens.splice(4).join("/")
    }
    else {
      const withoutFileName = path.substring(0, path.lastIndexOf('/'));
      const tokens = withoutFileName.split('/');
      return tokens.splice(2).join("/")
    }
  }


  private getDrillDownLevel(path: string): number {
    if (path.indexOf("/sites/") > -1) {
      // subsite
      const cleanUrl = path.replace(/\/+$/, '');
      const tokens = cleanUrl.split('/');
      return tokens.length - 5;
    }
    else {
      // root site
      const cleanUrl = path.replace(/\/+$/, '');
      const tokens = cleanUrl.split('/');
      return tokens.length - 3;
    }
  }


  private _saveValue = async (payload: any): Promise<boolean> => {
    try {

      const properties: Record<string, any> = payload;
      const list = this._sp.web.lists.getById(this.props.context.pageContext.list.id.toString());
      const item = list.items.getById(this.props.itemId);
      await item.update(properties);
      this.closeDialog();
      this.closeRemarksDialog();
      return true;
    } catch (error) {
      console.error('Error updating list item:', error);
      return false;
    }
  };

  // private async postDataToApi(url: string, payload: any) {
  //   try {
  //     const response: Response = await fetch(url, {
  //       method: 'POST',
  //       body: JSON.stringify(payload),
  //       headers: {
  //         'Accept': 'application/json;odata=nometadata',
  //         'Content-Type': 'application/json'
  //       },
  //     });
  //     const data = await response.json();
  //     console.log(data);

  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // }

}
