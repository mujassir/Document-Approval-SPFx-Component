# Document Approval Field Customizer

## Summary

A field customizer designed for SharePoint document libraries to integrate an approval workflow, leveraging Power Automate to send emails. The behavior and functionality of the field customizer can be finely tuned using a configuration list.

### Figma Mockups

- [Approval Workflow](https://tinyurl.com/Document-Approval-Wireframe)
- [Configuration List](https://tinyurl.com/Document-Approval-Config-List)


## Features

- **Approval Workflow Integration**: Seamlessly integrate an approval process into SharePoint document libraries.
- **Power Automate Emailing**: Automated email notifications triggered by Power Automate.
- **Granular Customization**: Define behaviors using a dedicated configuration list.
- **Fluent UI Integration**: A modern and intuitive UI for a better user experience.

## Technology Stack

- SPFx (SharePoint Framework)
- React
- Node.js
- Fluent UI

## Prerequisites

- Node.js installed (recommended latest LTS version)
- SharePoint Framework development environment set up
- Knowledge of React for any UI customizations

## Version Information

**Project Version**: 0.0.1

### Key Dependencies:

- **Node.js**: `>=16.13.0 <17.0.0`
- **React**: `17.0.1`
- **SharePoint Framework Libraries**: `1.17.4`


### Development Dependencies:

- **TypeScript**: `4.5.5`
- **Gulp**: `4.0.2`
- **ESLint**: `8.7.0`
- **PnP JavaScript Library**: `^3.17.0`
- **Fluent UI (React)**: `^7.199.1`

> Please ensure you have the right versions of the dependencies installed to avoid any discrepancies while building or deploying the project.


## Configuration List Details

To set up the field customizer, utilize the provided configuration list. The list includes the following columns:

- **Config Name**: The unique name for this configuration.
- **Document Library Name**: The name of the SharePoint document library targeted.
- **Folder Name**: Specific folder within the document library.
- **Drill Down Level**: Depth level within folders for operation.
- **Email Distribution List**: Email recipients for Power Automate notifications.

Ensure to populate this list with the relevant data to define how the field customizer operates.

## Running Locally:

1. Clone this repository:
```bash
   git clone https://github.com/mujassir/Document-Approval-SPFx-Component.git
```
2. Navigate to the solution folder:
```bash
   cd Document-Approval-SPFx-Component
```
3. Install the dependencies:
```bash
   npm install
```
4. Update the page URL and column name to test in the development environment
```bash
   "serveConfigurations": {
    "default": {
      "pageUrl": "https://[your-tenant-name]/sites/SharePointDevelopers/DocumentLibrary/Forms/AllItems.aspx",
      "fieldCustomizers": {
        "ApprovalStatusDev": {
         //ApprovalStatusDev is the column on which the customizer field will be rendered/applied when served
         // Column "ApprovalStatusDev" could be any name that exist in the DocumentLibrary

          "id": "df0e4e1c-b9a1-447f-8ba2-f18db13c02b0",
          "properties": {
            "sampleText": "Value"
          }
        }
      }
    },
```
5. To test and see your changes in SharePoint document library:
```bash
   gulp serve
```

## Package Deployment Guide

### Prepare .sppkg package file
For deploying to a SharePoint tenant, bundle and package the solution:
```bash
  gulp build
  gulp bundle --ship
  gulp package-solution --ship
```
### Installing the .sppkg package to the SharePoint environment

1. **Open SharePoint Admin Center**: Navigate to your SharePoint Admin Center. The URL typically looks like `https://[your-tenant-name]-admin.sharepoint.com`.
2. **Access the App Catalog**: In the left-hand navigation, locate and select **Apps** and then choose **App Catalog**.
3. **Upload the package**: Once in the App Catalog, select **Distribute apps for SharePoint**. From there, click on **New** to upload a new app. Browse to your `.sppkg` file and select to upload. You will be prompted to trust the client-side solution to deploy. Click **Deploy**.

### Adding the Installed App to a SharePoint Site

1. **Navigate to your target site**: Go to the SharePoint site where you want to add the app.
2. **Access Site Contents**: From the site homepage, click on the settings/gear icon at the top right corner, then select **Site contents**.
3. **Add an App**: In the site contents page, click on **+ New** and choose **App**.
4. **Install the App**: You'll see a library of available apps. Look for your app (it'll be named after your solution) and click on it. Follow the on-screen prompts to add and install the app on your site.

### Adding the Custom Column in the Document Library

1. **Access your Document Library**: Navigate to the document library or list where you wish to add the custom column.
2. **Go to List Settings**: From the Site Contents page, click on the ellipsis (`...`) next to your list or library and select **Settings** from the dropdown menu.
3. **Add from Existing Site Columns**: Navigate to **Columns** and select **Add from existing site columns**.
4. **Choose the Custom Column**: 
   - Under the **Select site columns from** dropdown, choose **SPFx Columns**.
   - From the available columns, locate and select the **ApprovalStatus** field that was provisioned from the solution package.
5. **Confirm the Addition**: Click **OK** to finalize adding the column to your document library.

> **Note**: Custom columns added from a SharePoint Framework (SPFx) solution, like the `ApprovalStatus` column, typically provide enhanced features or visualizations compared to native SharePoint columns. Ensure you have the necessary permissions and have properly deployed the SPFx solution to make these columns available for adding.

## FAQ (Frequently Asked Questions)

### Q: What does the Document Approval Field Customizer do?
**A**: The Document Approval Field Customizer integrates an approval workflow into SharePoint document libraries. It leverages Power Automate to send approval emails. The functionality can be tuned using a configuration list.

### Q: Can I customize the email distribution list?
**A**: Yes, the email distribution list can be specified in the configuration list provided with the solution.

### Q: Is this compatible with all SharePoint versions?
**A**: This field customizer is designed for SharePoint Online and may not work with older versions of SharePoint. Ensure you are using the SharePoint Framework version specified in the project details.

### Q: How do I troubleshoot issues with the field customizer?
**A**: Begin by checking the configuration list and ensuring all fields are correctly set. If issues persist, refer to the project's documentation or raise an issue on the GitHub repo.

### Q: Are there any costs associated with using Power Automate for sending emails?
**A**: Power Automate may have associated costs depending on the volume and frequency of emails and the licensing model you're under. Refer to Microsoft's official documentation for Power Automate's pricing details.

### Q: I found a bug. Where do I report it?
**A**: Please raise an issue on the GitHub repository with details about the bug. Make sure to include steps to reproduce it, the expected outcome, and any relevant screenshots or error messages.

---

If your question isn't listed here, feel free to raise an issue on the GitHub repository or contact the maintainer directly.


## Contributing

We welcome contributions from the community! If you'd like to contribute to this project:

1. **Fork the Repository**: Click on the 'Fork' button at the top right corner of this page.
2. **Clone the Forked Repository**: Clone your forked repository to your local machine.
3. **Create a New Branch**: For each feature or improvement, create a separate branch.
4. **Make Changes**: Make your changes and commit them with a meaningful commit message.
5. **Push to your Fork**: Push your changes to your fork on GitHub.
6. **Open a Pull Request**: From your fork, open a pull request. Ensure you provide a detailed description of your changes.
7. **Review**: Wait for the repository maintainers to review your changes. Address any feedback if required.

For detailed guidance on how to contribute, please refer to the [Contributing Guidelines](LINK-TO-CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).


## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

