const fs = require('fs');
const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const fetch = require("node-fetch");
const cors = require('cors');
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: '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' });

app.use(express.static('public'));
app.use(cors());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/instancespeed', async (req, res) => {
    let instances = [
        "yewtu.be",
        "vid.puffyan.us",
        "yt.artemislena.eu",
        "invidious.flokinet.to",
        "invidious.projectsegfau.lt",
        "invidious.privacydev.net",
        "iv.melmac.space",
        "iv.ggtyler.dev",
        "invidious.lunar.icu",
        "inv.nadeko.net",
        "inv.tux.pizza",
        "invidious.protokolla.fi",
        "iv.nboeck.de",
        "invidious/private/coffee",
        "yt.drgnz.club",
        "iv.datura.network",
        "invidious.fdn.fr",
        "invidious.perennialte.ch",
        "yt.cdaut.de",
        "invidious.drgns.space",
        "inv.us.projectsegfau.lt",
        "invidious.einfachzocken.eu",
        "invidious.nerdvpn.de",
        "invidious.jing.rocks",
        "vid.lilay.dev",
        "inv.oikei.net",
        "invidious.privacyredirect.com"
    ];
    let testResults = [];
    instances.forEach(ins => {
        console.time(ins);
        fetch('https://' + ins + '/api/v1/stats').then(_ => {
            console.timeEnd(ins);
        });
    });
    res.json(testResults)
});

app.get('/video/:id', async (req, res) => {
    ytdl.getBasicInfo(req.params.id).then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    });
    // let info = await ytdl.getInfo(req.params.id);
    // console.log(info === null);
    // res.json(info);
});

app.get('/watch/:id', async (req, res) => {
    const regex = /^[a-zA-Z0-9-_]{11}$/;
    if (req.params.id.match(regex) === null) {
        res.send('Error loading...');
        return;
    }
    let info = await ytdl.getInfo(req.params.id);
    res.json(info);
});

app.get('/search/:q', async (req, res) => {
    let data = await fetch('https://invidious.projectsegfau.lt/api/v1/search?q=4k%20demo%20video');
    let json = await data.json();
    res.json(json);

});

app.get('/ai/search/:q/:count', async (req, res) => {
    const chatCompletion = await groq.chat.completions.create({
        "messages": [
            {
                "role": "system",
                "content": `List the top ${req.params.count} youtube videos for the given category.\n\nOutput in json format with these keys:\n\ntitle\nvideoId\nthumbnailUrl\n\nNo explanations, no notes, just a valid json object`
            },
            {
                "role": "user",
                "content": req.params.q
            }
        ],
        "model": "llama3-70b-8192",
        "temperature": 1,
        "max_tokens": 8192,
        "top_p": 1,
        "stream": false,
        "stop": null
    });

    console.log(chatCompletion.choices[0].message.content);
    try {
        let json = JSON.parse(chatCompletion.choices[0].message.content);
        res.json(json);
    } catch (err) {
        res.status(403).json(err);
    }
    //res.json(JSON.parse(chatCompletion.choices[0].message.content));
});

app.listen(8080, (err) => {
    if (err) console.log(err);
    else { console.log('App listening on 8080') }
});

// https://youtu.be/xvFZjo5PgG0
// https://youtu.be/jOZHZHqI79U