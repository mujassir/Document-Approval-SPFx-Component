# Document Approval Field Customizer

## Summary

A field customizer designed for SharePoint document libraries to integrate an approval workflow, leveraging Power Automate to send emails. The behavior and functionality of the field customizer can be finely tuned using a configuration list.

### Figma Mockups

- [Approval Workflow](https://tinyurl.com/Document-Approval-Wireframe)
- [Configuration List](https://tinyurl.com/Document-Approval-Config-List)

## Technology Stack

- SPFx (SharePoint Framework)
- React
- Node.js
- Fluent UI

## Prerequisites

- Node.js installed (recommended latest LTS version)
- SharePoint Framework development environment set up
- Knowledge of React for any UI customizations

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
      "pageUrl": "https://{Your SharePoint Environment}/sites/SharePointDevelopers/DocumentLibrary/Forms/AllItems.aspx",
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
5. To test and see your changes in SharePoint Workbench:
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



## Features

- **Approval Workflow Integration**: Seamlessly integrate an approval process into SharePoint document libraries.
- **Power Automate Emailing**: Automated email notifications triggered by Power Automate.
- **Granular Customization**: Define behaviors using a dedicated configuration list.
- **Fluent UI Integration**: A modern and intuitive UI for better user experience.

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

