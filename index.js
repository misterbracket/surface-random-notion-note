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
// - paginate databases
// - button to open in browser
// - open on start up

async function getRandomeDatabaseId() {
	const response = await notion.search({
		filter: {
			value: 'database',
			property: 'object'
		}
	});
	const randomDatabaseIdx = random(0, response.results.length);
	const databaseId = response.results[randomDatabaseIdx].id;
	return databaseId;
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
	let notes = [];
	const res = await getPaginatedNotes();
	await notes.push.apply(notes, res.results);
	return res;
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
	databaseId = await getRandomeDatabaseId();
	const allNotes = await getAllNotes();
	const note = getRandomNote(allNotes);
	openUrlInBrowser(note.url);
})();
