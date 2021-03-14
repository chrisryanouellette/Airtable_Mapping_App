# Airtable Mapping App

This custom app creates a JSON file to be used with the [Airtable Automation Helpers](https://github.com/chrisryanouellette/Airtable_Automation_Helpers) package.

## Installing the Mapping App

To begin, clone this repo and follow the steps below.

1. Open the Base you want to create mappings for.
2. Install a [new Custom App](https://airtable.com/developers/apps/guides/hello-world-tutorial). Choose the TypeScript option.
3. Continue to step two "Get started" and copy the App and Base ID portion of step two. ( appj123123/blk321312 )
4. In this repo, run the add block Node script with command `npm run-script add-block`
5. Follow the prompts displayed from the script and once complete, you will see a new file in the `./block` folder with the name you entered or the default `remote.json` file.
6. If this is the first time installing the app run the Node script `npm run-scripts release-local`. If this is a secondary installation run the release Node script with `npm run-scripts release` and follow the prompts.
7. In Airtable, reload the App and the Mapping App will be installed and ready for use.


## Using the App

1. If you updating or extending some existing mappings, enter them by clicking the edit icon in the top right of the app.
2. Follow the steps in the app for pages 1-3.
3. Page 4 allows you to change the reference name used for any tables, views, or fields.
4. The final step will output the mappings.

## Example Mapping

```js
const { bases, tables, views } = {
    "bases": {
        "developmentSandbox": {
            "id": "app123321",
            "name": "Development Sandbox",
            "tables": {
                "table": "tblabccba"
            }
        }
    },
    "tables": {
        "table": {
            "id": "tblabccba",
            "name": "Table 1",
            "baseId": "app123321",
            "views": {
                "gridView": "viw123abc"
            }
        }
    },
    "views": {
        "gridView": {
            "id": "viw123abc",
            "name": "Grid view",
            "tableId": "tblabccba",
            "fields": {
                "name": {
                    "id": "fldxyzzyx",
                    "tableId": "tblabccba",
                    "viewId": "viw123abc",
                    "name": "Name",
                    "type": "singleLineText",
                    "refName": "name"
                }
            }
        }
    }
}
```