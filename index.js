#!/usr/bin/env node

/**
 * surface-random-notion-note
 * Will open a random notion note
 *
 * @author Max Klammer <http://maxklammer.com>
 */

const init = require('./utils/init');
const cli = require('./utils/cli');
const { logSuccess, logError, logInfo } = require('./utils/log');
const { Client } = require('@notionhq/client');
const open = require('open');

const input = cli.input;
const flags = cli.flags;
const { debug } = flags;

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

// eslint-disable-next-line no-undef
const notion = new Client({ auth: process.env.NOTION_KEY });

let databaseId = '';

// TODO:
// - Add support for multiple notion databases ✅
// - add pagination ✅
// - add readme ✅
// - figure out token store ✅
// - pretty logs ✅
// - open page in browser ✅
// - paginate databases ✅
// - retrieve size of each db and show note with dirtibition.
// - - maybe create a local cache so subsequent requests get faster?
// - - maybe query pages directly and create a cache
// - button to open in browser
// - open on start up

async function getPaginatedDatabases(currentCursor = undefined, data = []) {
	try {
		const response = await notion.search({
			start_cursor: currentCursor,
			filter: {
				value: 'database',
				property: 'object'
			}
		});
		data.push.apply(data, response.results);
		if (response.has_more === false) {
			return data;
		}

		return getPaginatedDatabases(response.next_cursor, data);
	} catch (error) {
		logError('Something went wrong: ' + error);
	}
}

async function getAllDatabases() {
	return await getPaginatedDatabases();
}

async function getPaginatedNotes(currentCursor = undefined, data = []) {
	try {
		const response = await notion.databases.query({
			database_id: databaseId,
			start_cursor: currentCursor
		});
		data.push.apply(data, response.results);
		if (response.has_more === false) {
			return data;
		}

		return getPaginatedNotes(response.next_cursor, data);
	} catch (error) {
		logError('Something went wrong: ' + error);
	}
}
async function getAllNotes() {
	return await getPaginatedNotes();
}

function getRandomNote(allNotes) {
	const randomPageIdx = random(0, allNotes.length);
	const note = allNotes[randomPageIdx];
	const url = note.url;
	logSuccess(`📒 Your random Note of the day is: \n 🔗 ${url}`);
	return note;
}

async function openUrlInBrowser(url) {
	logInfo('✨ Opening note in your default browser... ✨');
	await open(url);
}

(async () => {
	init();
	input.includes(`help`) && cli.showHelp(0);
	debug && logInfo(flags);
	const allDatabases = await getAllDatabases();
	const randomDatabaseIdx = random(0, allDatabases.length);
	databaseId = allDatabases[randomDatabaseIdx].id;
	const allNotes = await getAllNotes();
	const note = getRandomNote(allNotes);
	openUrlInBrowser(note.url);
})();
