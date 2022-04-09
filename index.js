//Chalk -Start
const chalk = require('chalk');
const warnC = chalk.bgRed.black;
const DoneC = chalk.bgGreen.black;
const titleC = chalk.bgYellow.black;
const listC = chalk.bgBlue.black;
//Chalk -End

//FileSystem Read & Write -Start
const fs = require('fs');

function readNotes()
{
    try 
    {
        const data = fs.readFileSync('./notes.json','utf-8');
        try
        {
            let notes = JSON.parse(data);
            // console.log(notes);
            return notes;
        } 
        catch (err){console.log("Error parsing JSON",err);}
    }
    catch (err) {console.log(err);}
}
function writeNotes(newnotes)
{
    fs.writeFile('./notes.json',newnotes,(err)=>{
        if(err) console.log(err);
        // else console.log(DoneC("Notes Updated"));
    })
}
//FileSystem Read & Write -End

//Operations Arguments -Start
const operation = process.argv[2];
switch(operation)
{
    case 'add':
        addnote();
        break;
    case 'remove':
        removenote();
        break;
    case 'list':
        listnote();
        break;
    case 'read':
        readnote();
        break;
    default:
        usage();
        break;
}
function addnote()
{
    const title = process.argv[3];
    const desc = process.argv[4];
    if(title === undefined || desc === undefined)
    {
        usage();
        return;
    }
    let notes = readNotes();

    if(notes[title] == undefined) //check existence
    {
        notes[title] = {desc:desc};
        const newnotes = JSON.stringify(notes,null,2);
        writeNotes(newnotes);
        console.log(DoneC("New Note Added"));
    }
    else console.log(warnC("Title already taken"));
}
function removenote()
{
    const title = process.argv[3];
    if(title === undefined)
    {
        usage();
        return;
    }

    let notes = readNotes();
    if(notes[title] != undefined)
    {
        delete notes[title];
        const newnotes = JSON.stringify(notes,null,2);
        writeNotes(newnotes);
        console.log(DoneC("note " +title +" removed"));
    }
    else console.log(warnC("Note not found"));
}
function readnote()
{
    const title = process.argv[3];
    if(title === undefined)
    {
        usage();
        return;
    }
    const notes = readNotes();
    if(notes[title] != undefined)
    {
        console.log(titleC(title));
        console.log(notes[title].desc);
    }
    else console.log(warnC("Note not found"));
}
function listnote()
{
    const notes = readNotes();
    let titles = Object.keys(notes);
    if(titles.length >0)
    {
        console.log(listC("\nYour Notes"));
        for(let i=0; i<titles.length; i++)
        {
            console.log(titles[i]);
        }
    }
    else console.log(warnC("\nNo notes in database"));
}
function usage()
{
    console.log(warnC("invalid operation"));
    const Add = titleC("ADD:") + " node <filename> add <title> <desc>\n";
    const Read = titleC("Read:") + " node <filename> read <title>\n";
    const List = titleC("List:") + " node <filename> list\n";
    const Remove = titleC("Remove:") + " node <filename> remove <title>\n";
    console.log(DoneC("\nUsage\n\n") + Add + Read + List + Remove + warnC("\ntitle & desc should be in quotes & case-sensitive"));
}
//Operations Arguments -End