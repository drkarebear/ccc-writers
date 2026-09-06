/**
 * CCC Writers Community Contribution Form builder
 *
 * Run createCCCWritersContributionForm() once in Google Apps Script.
 * The script creates a Google Form plus a linked response spreadsheet.
 * It logs both the public form URL and the edit URL.
 */
function createCCCWritersContributionForm() {
  const form = FormApp.create('CCC Writers Community Contribution Form');
  form.setDescription(
    'Help keep the California Community College creative writing map current. ' +
    'Use this form to add a literary journal or event, correct a listing, or suggest a CSU/UC creative writing program. ' +
    'Submissions are reviewed before publication. Please provide an official public source whenever possible. ' +
    'Do not submit student ID numbers, private student information, passwords, or unpublished student manuscripts.'
  );
  form.setConfirmationMessage(
    'Thank you for helping keep CCC Writers current. Your submission will be reviewed before anything is added or changed on the public site.'
  );
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setProgressBar(true);
  form.setShuffleQuestions(false);

  form.addMultipleChoiceItem()
    .setTitle('What would you like to add or update?')
    .setChoiceValues([
      'Add a California Community College literary journal',
      'Update or correct a literary journal listing',
      'Share a creative writing event',
      'Suggest a CSU or UC creative writing program',
      'Other correction or suggestion'
    ])
    .setRequired(true);

  form.addTextItem()
    .setTitle('College or university name')
    .setHelpText('For example: Los Angeles Mission College or California State University, Northridge.')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Journal, event, or program name')
    .setHelpText('Use the official title when possible.')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Official public source URL')
    .setHelpText('Required: official college page, journal site, event page, submission page, or university program page.')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Additional useful URL')
    .setHelpText('Optional: submission form, journal archive, transfer roadmap, event registration page, etc.');

  form.addListItem()
    .setTitle('California region')
    .setChoiceValues([
      'Far North', 'North Coast', 'Sacramento / Sierra', 'Bay Area', 'Central Valley',
      'Central Coast', 'Los Angeles', 'Inland Empire', 'Orange County', 'San Diego',
      'Not sure / not applicable'
    ]);

  form.addSectionHeaderItem().setTitle('For literary journals or journal updates');

  form.addCheckboxItem()
    .setTitle('Who is eligible to submit?')
    .setChoiceValues([
      'Current students at the host college',
      'Alumni',
      'Students at other California Community Colleges',
      'Community college students nationwide',
      'Faculty or staff',
      'Community members',
      'General public',
      'Not sure / please verify'
    ]);

  form.addCheckboxItem()
    .setTitle('Genres or media accepted')
    .setChoiceValues([
      'Poetry', 'Fiction', 'Creative nonfiction', 'Drama / playwriting', 'Screenwriting',
      'Visual art', 'Photography', 'Comics / graphic narrative', 'Film / video',
      'Audio / music', 'Multilingual work', 'Other', 'Not sure / please verify'
    ]);

  form.addTextItem()
    .setTitle('Submission window or opening date')
    .setHelpText('Optional. Example: September 1, year-round, or Fall semester.');

  form.addTextItem()
    .setTitle('Submission deadline')
    .setHelpText('Optional. Include the year if the source gives one.');

  form.addTextItem()
    .setTitle('Submission URL')
    .setHelpText('Optional if different from the official source URL.');

  form.addSectionHeaderItem().setTitle('For creative writing events');

  form.addTextItem().setTitle('Event date or date range');
  form.addTextItem().setTitle('Event time');
  form.addTextItem().setTitle('Event location or online format');
  form.addTextItem().setTitle('Who can attend?');
  form.addTextItem().setTitle('Event registration or information URL');

  form.addSectionHeaderItem().setTitle('For CSU or UC creative writing programs');

  form.addMultipleChoiceItem()
    .setTitle('Program system')
    .setChoiceValues(['CSU', 'UC', 'Not sure / not applicable']);

  form.addCheckboxItem()
    .setTitle('Program type')
    .setChoiceValues(['Major', 'Concentration / option', 'Minor', 'Certificate', 'Transfer pathway', 'Other', 'Not sure']);

  form.addTextItem()
    .setTitle('Transfer pathway or roadmap URL')
    .setHelpText('Optional.');

  form.addSectionHeaderItem().setTitle('Anything else we should know?');

  form.addParagraphTextItem()
    .setTitle('Notes or correction details')
    .setHelpText('Tell us what changed, what needs checking, or any context that will help verify the listing.');

  form.addTextItem()
    .setTitle('Your name')
    .setHelpText('Optional. Used only if follow-up is needed; it is not published with the listing.');

  form.addTextItem()
    .setTitle('Your email')
    .setHelpText('Optional. Used only if follow-up is needed; it is not published with the listing.');

  form.addCheckboxItem()
    .setTitle('Before you submit')
    .setChoiceValues([
      'I understand that this is a moderated submission and that CCC Writers may verify, edit, decline, or delay publication of the information I provided.'
    ])
    .setRequired(true);

  const sheet = SpreadsheetApp.create('CCC Writers Community Contributions');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  Logger.log('PUBLIC FORM URL: ' + form.getPublishedUrl());
  Logger.log('FORM EDIT URL: ' + form.getEditUrl());
  Logger.log('RESPONSES SHEET URL: ' + sheet.getUrl());
}
