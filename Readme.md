# Surface Random Notion Notes

## Introduction

This little utility will open a random note that you took in Notion. You can decide which databases you want to use.

Currently, it will only surface notes that are part of a database. 

## Usage

You can use `npx` to run this utility.

```bash
npx @maxklammer/surface-random-notion-note
```

Alternatively you can install this utility globally.

```bash
npm i -g @maxklammer/surface-random-notion-note

// To run the utility
 surface
 // or
 surface-random-notion-note

```

## Configuration

You need to add an integration your Notion account.
Go to the Notion Setting and add an integration. Copy the integration key and place it in your shell `rc` file of your choice. This might be `.zshrc` or `.bashrc`, depending on the shell you use. 

```bash
export NOTION_KEY="<your notion integration key>"
```
Restart your shell and run `echo $NOTION_KEY`to make sure that the key was saved properly. 

Finally back in Notion, you need to share the pages that contain the databases with the integration.

