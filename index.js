var Botkit = require('botkit')
//var GoogleTranslateApi = require('google-translate-api-nodejs-client')

var token = process.env.SLACK_TOKEN

var controller = Botkit.slackbot({
  // reconnect to Slack RTM when connection goes bad
  retry: Infinity,
  debug: false
})

// Assume single team mode if we have a SLACK_TOKEN
if (token) {
  console.log('Starting in single-team mode')
  controller.spawn({
    token: token,
    retry: Infinity
  }).startRTM(function (err, bot, payload) {
    if (err) {
      throw new Error(err)
    }

    console.log('Connected to Slack RTM')
  })
// Otherwise assume multi-team mode - setup beep boop resourcer connection
} else {
  console.log('Starting in Beep Boop multi-team mode')
  require('beepboop-botkit').start(controller, { debug: true })
}

controller.hears('Translate', ['direct_mention'], function (bot, message) 
		{
		   var GoogleSpreadsheet = require('google-spreadsheet');
		   var async = require('async');	
		   var doc = new GoogleSpreadsheet('1JjDynxgjDGTybyEk09TMFmZyqMKqkNdrSl1fRQdrpew');
		   var sheet;
		   var from = "en";
		   var to = "es";
		   var text = "This is a test";
		   var translate = '=gTranslate("'+text+'","'+from+'","'+to+'")';
		   async.series
		   ([
		        function setAuth(step) {
				var creds = require('./slackhack-5aef253ddb27.json');
		     		 var creds_json = {
      client_email: 'vjqatesting@gmail.com',
      private_key: 'AIzaSyAHnC2J-ChrpQ7iCDEgktI1xozaZ6V74SE'
    }

			doc.useServiceAccountAuth(creds, step);
			     },
		  function getInfoAndWorksheets(step) {
		    doc.getInfo(function(err, info) {
		      //console.log('Loaded doc: '+info.title+' by '+info.author.email);
		      bot.reply(message, 'Loaded doc: '+info.title+' by '+info.author.email)
		      sheet = info.worksheets[0];
			//console.log('sheet 1: '+sheet.title+' '+sheet.rowCount+'x'+sheet.colCount);
			bot.reply(message, 'sheet 1: '+sheet.title)
			bot.reply(message, translate)
			    
  		        ws = session.getActiveSheet('Translator')['$[]'](0);
                        //ws['$[]='](2, 1, "=gTranslate(\"this is a test\", \"en\", \"es\")");
                        //ws.$save();
                        //ws.$reload();
                        //return self.$puts(ws['$[]'](self.$i(), 1));		
			//var vals=s.getValues();
  			//sheet2.appendRow([translate]);
			bot.reply(message, ws)	  
		      step();
		    })}
		   ]);
		})

controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "I'm here!")
})
/*
controller.hears(['hello', 'hi'], ['direct_mention'], function (bot, message) {
  bot.reply(message, 'Hello.')
})*/
controller.hears(['hello', 'hi'], ['direct_message'], function (bot, message) {
  bot.reply(message, 'Hello.')
  bot.reply(message, 'It\'s nice to talk to you directly.')
})

controller.hears(['How are you', 'How r u'], ['direct_message'], function (bot, message) {
  bot.reply(message, 'Good Thanks!')
})

controller.hears('.*', ['mention'], function (bot, message) {
  bot.reply(message, 'You really do care about me. :heart:')
})

/*
controller.hears('help', ['direct_message', 'direct_mention'], function (bot, message) {
  var help = 'I will respond to the following messages: \n' +
      '`bot hi` for a simple message.\n' +
      '`bot attachment` to see a Slack attachment message.\n' +
      '`@<your bot\'s name>` to demonstrate detecting a mention.\n' +
      '`bot help` to see this again.'
  bot.reply(message, help)
})
*/

controller.hears('help', ['direct_message', 'direct_mention'], function (bot, message) {
  var help = 'Please do it in the following format: \n' +
      '`@languagebot Translate "<Word/Sentence>", "<from language - language code>", "<to language - language code>"` \n' +
      'Eg. @languagebot Translate "This is a test", "en", "es" \n' +
      '`@languagebot language codes` for language codes available.\n'
  bot.reply(message, help)
})


controller.hears('language codes', ['direct_message', 'direct_mention'], function (bot, message) {
  var languagecodes = 'Language codes available: \n' +
      '`af` - Afrikaans		`sq` - Albanian		`ar` - Arabic		`az` - Azerbaijani\n' +
      '`eu` - Basque		`bn` - Bengali		`be` - Belarusian	`bg` - Bulgarian\n' +
      '`ca` - Catalan		`af` - Albanian		`ar` - Arabic		`az` - Azerbaijani\n' +
      '`zh-CN` - Chinese Simplified	`zh-TW` - Chinese Traditional		`hr` - Croatian\n' +
      '`cs` - Czech		`et` - Danish		`nl` - Dutch		`en` - English\n' +
      '`eo` - Esperanto		`et` - Estonian		`tl` - Filipino		`fi` - Finnish\n' +
      '`fr` - French		`gl` - Galician		`ka` - Georgian		`de` - German\n' +
      '`el` - Greek		`gu` - Gujarati		`ht` - Haitian Creole	`iw` - Hebrew\n' +
      '`hi` - Hindi		`hu` - Hungarian	`is` - Icelandic	`id` - Indonesian\n' +
      '`ga` - Irish		`it` - Italian		`ja` - Japanese		`kn` - Kannada\n' +
      '`ko` - Korean		`la` - Latin		`lv` - Latvian		`lt` - Lithuanian\n' +
      '`mk` - Macedonian	`ms` - Malay		`mt` - Maltese		`no` - Norwegian\n' +
      '`fa` - Persian		`pl` - Polish		`pt` - Portuguese	`ro` - Romanian\n' +
      '`ru` - Russian		`sr` - Serbian		`sk` - Slovak		`sl` - Slovenian\n' +
      '`es` - Spanish		`sw` - Swahili		`sv` - Swedish		`ta` - Tamil\n' +
      '`te` - Telugu		`th` - Thai		`tr` - Turkish		`uk` - Ukrainian\n' +
      '`ur` - Urdu		`vi` - Vietnamese	`cy` - Welsh		`yi` - Yiddish\n' 
  bot.reply(message, languagecodes)
})

controller.hears(['attachment'], ['direct_message', 'direct_mention'], function (bot, message) {
  var text = 'Beep Beep Boop is a ridiculously simple hosting platform for your Slackbots.'
  var attachments = [{
    fallback: text,
    pretext: 'We bring bots to life. :sunglasses: :thumbsup:',
    title: 'Host, deploy and share your bot in seconds.',
    image_url: 'https://storage.googleapis.com/beepboophq/_assets/bot-1.22f6fb.png',
    title_link: 'https://beepboophq.com/',
    text: text,
    color: '#7CD197'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {
    console.log(err, resp)
  })
})

controller.hears('.*', ['direct_message', 'direct_mention'], function (bot, message) {
  bot.reply(message, 'Sorry <@' + message.user + '>, I don\'t understand. \n')
})

