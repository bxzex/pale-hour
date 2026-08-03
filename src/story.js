/**
 * All of the writing lives here.
 *
 * The story is told three ways, in increasing order of how hard you have to
 * work for it:
 *
 *  1. The intro cards — who you are and why you came back. Unmissable.
 *  2. The fragment lines — one beat per page, forced on you as you collect.
 *  3. The notes — ten optional documents, found inside buildings. These carry
 *     the actual history, and they are the only place the ending is explained
 *     before it happens.
 *
 * Deliberate restraint: nothing here names what the thing *is*. The horror is
 * in the bureaucracy around it — a village that filed paperwork about a god.
 */

export const TITLE = 'PALE HOUR';

/** Shown once, before the first run of a session. */
export const INTRO = [
  {
    kicker: 'ASHEN FOLD — 14 MILES OF UNMADE ROAD',
    body: 'Eleven years ago my brother walked into this forest to bring back the register. He was nineteen. They found his torch, still on, forty feet up a tree.',
  },
  {
    kicker: 'THE COVENANT',
    body: 'The village kept eight pages. Every autumn the warden read the eight names aloud at the treeline, and every autumn nothing happened, and everyone agreed that was the point.',
  },
  {
    kicker: 'THE LAST READING WAS IN 1974',
    body: 'Then the parish closed, the warden died, and no one read anything. The pages are still out there, nailed where they fell.',
  },
  {
    kicker: 'TONIGHT',
    body: 'Find all eight. Get to the gate before the hour turns. That is the whole plan, and I have written it down so I cannot talk myself out of it.',
  },
];

/**
 * One line per fragment, fired on pickup. These escalate from procedural to
 * personal — by page six the narrator has stopped pretending this is fieldwork.
 */
export const FRAGMENT_LINES = [
  'One. The handwriting is the warden\'s. Careful, and pressed too hard.',
  'Two. Someone counted these before me. The nail holes are older than the paper.',
  'Three. My torch is warm. It has never been warm before.',
  'Four. It is not hiding. It is <i>letting me work</i>.',
  'Five. Tom\'s name is on this one. Written in, not printed.',
  'Six. The names are not victims. They are <i>signatures</i>.',
  'Seven. Every reading renewed it. Eleven years unread and it has come to collect in person.',
  'Eight. The last name on the register is mine, and the ink is not dry. <i>Run.</i>',
];

/**
 * The ten findable notes. `place` is a hint used for placement preference —
 * notes about the house go in the house.
 */
export const NOTES = [
  {
    id: 'warden-1',
    title: 'WARDEN\'S LOG — OCT 1961',
    place: 'farmhouse',
    body: [
      'Read the eight at first frost as always. Wind took the fourth page out of my hand and put it back. I am recording that plainly because I do not intend to discuss it.',
      'Nothing followed me home. Nothing ever does. That is not the same as nothing being there.',
    ],
  },
  {
    id: 'child',
    title: 'ON THE BACK OF A SCHOOL EXERCISE BOOK',
    place: 'cabin',
    body: [
      'the tall one stands in the trees at the edge of the field and does not come closer if you look at it',
      'so we made a game. everyone looks in a different direction and then it cannot move at all',
      'we played it for a whole hour. we won. mum was very angry about the hour',
    ],
  },
  {
    id: 'register',
    title: 'INSTRUCTION PINNED INSIDE THE REGISTER',
    place: 'farmhouse',
    body: [
      'The eight names are to be read aloud at the treeline, in order, once each year, by the warden or by a person of sound mind who has volunteered.',
      'The reader is to say their own name last.',
      'The register is not to leave the parish. The register is not to be completed.',
    ],
  },
  {
    id: 'surveyor',
    title: 'ORDNANCE SURVEY — FIELD NOTE',
    place: 'cabin',
    body: [
      'Third attempt at triangulating this wood. Third set of contradictory bearings. The stand of pines north of the chapel measures 240 m across going in and 310 m coming back.',
      'I am recommending the area be marked unmapped rather than continue to spend public money proving I cannot count.',
    ],
  },
  {
    id: 'search',
    title: 'SEARCH PARTY — DAY 4',
    place: 'cabin',
    body: [
      'We have swept the eastern quarter twice. Dogs will not enter past the fence line and I will not make them.',
      'Found his torch. Still lit, after four days. I want that written down by someone other than me, because I know how it sounds.',
    ],
  },
  {
    id: 'tom-1',
    title: 'TOM\'S NOTEBOOK — FIRST PAGE',
    place: 'farmhouse',
    body: [
      'If you are reading this you came looking, which means I did not come back, which means I was right about at least one thing.',
      'The pages are not a warning. I have been treating them like a warning for two months and that is why I have got nowhere.',
    ],
  },
  {
    id: 'tom-2',
    title: 'TOM\'S NOTEBOOK — TORN PAGE',
    place: 'cabin',
    body: [
      'Eight names. Eight families that stayed when everyone else left. Every one of them prospered. Not a single bad harvest in ninety years, in a valley where nothing grows.',
      'It was never taking from us. We were paying, and we were getting our money\'s worth, and at some point we stopped noticing which of those came first.',
    ],
  },
  {
    id: 'priest',
    title: 'LETTER, UNSENT, TO THE DIOCESE',
    place: 'farmhouse',
    body: [
      'You ask what I believe is in the wood. I believe it is a contract, and I believe it is being honoured, and I believe my congregation would be considerably less calm if it were not.',
      'You ask whether I have attempted an exorcism. I have not. One does not exorcise a creditor.',
    ],
  },
  {
    id: 'warden-last',
    title: 'WARDEN\'S LOG — FINAL ENTRY, 1974',
    place: 'farmhouse',
    body: [
      'No one came to the reading. I stood at the treeline for two hours with the eight pages and read them to an empty field, and then I read my own name, and then I went home.',
      'I am eighty-one. There will not be another reading. Whoever finds this: it is owed eight, and it has been patient, and patience is not the same as mercy.',
    ],
  },
  {
    id: 'last-hand',
    title: 'SCRATCHED INTO A DOOR FRAME',
    place: 'cabin',
    body: [
      'IT DOES NOT CHASE',
      'IT ARRIVES',
      'THE DIFFERENCE MATTERS WHEN YOU ARE DECIDING WHETHER TO RUN',
    ],
  },
];

/** Fired the first time a note is picked up, to teach the mechanic. */
export const FIRST_NOTE_HINT = 'A note. <i>Read it.</i> They are not the register — they are the people who kept it.';

/**
 * Endings. `notesRead` changes the epilogue: finish the run without reading
 * anything and you get the blunt version, read most of them and you get the
 * one that lands.
 */
export const ENDINGS = {
  escaped: {
    tag: 'RECOVERED FOOTAGE',
    title: 'OUT',
    sub: 'Eight pages, and the gate let you through. Behind you the forest is exactly as quiet as it was before you arrived.',
    epilogue: {
      few: 'You have the register. You do not know what it is for. That will be someone else\'s problem, in a year, at first frost.',
      many: 'The register is complete. Eight names, and yours written last in a hand you recognise, because it is your brother\'s. The covenant is renewed. Something in the treeline is satisfied, and being satisfied is not the same as being finished.',
    },
  },
  caught: {
    tag: 'SIGNAL LOST',
    title: 'COLLECTED',
    sub: 'It did not chase you. It arrived, the way it always has, at the place you were going to be.',
    epilogue: {
      few: 'The tape runs for another nine minutes. There is nothing on it but the forest, and the forest is not doing anything unusual.',
      many: 'Somewhere a page is being amended. The debt was eight, and the arithmetic has never once been wrong.',
    },
  },
  consumed: {
    tag: 'TAPE CORRUPTED',
    title: 'UNMADE',
    sub: 'You looked, and kept looking, and the looking was the whole transaction.',
    epilogue: {
      few: 'The static took the picture first. Whatever it took after that did not make a sound.',
      many: 'The warden wrote that the reader must say their own name last. You never got to the end of the list. It said it for you.',
    },
  },
};

/** Menu flavour, rotated each time the menu is shown. */
export const MENU_LINES = [
  'Eight fragments. One forest.<br />Something is already counting.',
  'It does not chase.<br />It arrives.',
  'The last reading was in 1974.<br />It has been patient.',
  'Eight names were enough for ninety years.<br />Nobody asked what happens at nine.',
];
