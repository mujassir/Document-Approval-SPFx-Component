import { Log } from '@microsoft/sp-core-library';
import * as React from 'react';

import styles from './ApproveRejectField.module.scss';
import Dialog, { DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';

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
  itemId: string;
  fieldValue: string;
}

const LOG_SOURCE: string = 'ApproveRejectField';

export default class ApproveRejectField extends React.Component<IApproveRejectFieldProps, {}> {
  public state = {
    approvalDialogHidden: true,
  };
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
    return (
      this.props.fieldValue == "Approved" || this.props.fieldValue == "Rejected" ?
        (
          <div className={this.props.fieldValue == "Approved" ? styles.approved : styles.rejected}>
            {this.props.fieldValue}
          </div>
        ) : (

          <div>
            <button className={styles.actionButton} onClick={() => { this.performAction_Click() }}>
              <span className="ms-Button-label">Perform Action</span>
            </button>
            {this.renderDialog()}
          </div>
        )
    );

  }

  private renderDialog() : React.ReactElement<{}>{
    return (
      <Dialog
        hidden={this.state.approvalDialogHidden}
        onDismiss={this.closeDialog}
        dialogContentProps={dialogContentProps}
      >
        <DialogFooter>
          <PrimaryButton onClick={this.approve_Click} text="Approve" />
          <DefaultButton onClick={this.reject_Click} text="Reject" />
          <DefaultButton onClick={this.closeDialog} text="Cancel" />
        </DialogFooter>
      </Dialog>
      );

  }

  private performAction_Click() {
    this.setState({ approvalDialogHidden: false });
  }

  private approve_Click(){
    this.closeDialog();


  }

  private reject_Click(){
    this.closeDialog();

  }

  private closeDialog(){
    this.setState({ approvalDialogHidden: true });
  }
}
