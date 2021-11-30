const scraper= require("./scrape");
var myArgs = process.argv.slice(2);
async function show(query){//testing function for adding new shops
    const res= await scraper.grandshop(query);
    //console.log(res);
    console.table(res);
}
function wordcount(query, name){
    let wordlist=query.toLowerCase().split(" ");
    count=0;
    name=name.toLowerCase();
    wordlist.forEach((v)=>{
        if (name.includes(v)){
            count++;
        }
    });
    return count;
}
async function compare(query){
    let all= await Promise.all([
    scraper.enter(query),
    scraper.neocomputer(query),
    //scraper.matrix(query), idk
    //uno,//price sorting broken??
    //bigshop,//bad item search
    scraper.itunexx(query),// bad implementation??
    scraper.doxyterra(query),
    //nanoteh,//ssl certificat probleme
    scraper.hamster(query),
    scraper.cosmo(query),
    scraper.maxmart(query),
    scraper.maximum(query),
    scraper.gorilla(query),
    scraper.shopit(query),
    scraper.pandashop(query),
    //scraper.darwin(query),//antiscalping?
    //scraper.netmarket(query),//api problems
    //scraper.zap(query),//bugged ajax?
    scraper.fantastic(query),
    scraper.smadshop(query),
    scraper.electro(query),
    scraper.gsmshop(query),//only first page checked
    scraper.primepc(query),
    scraper.gig(query),//only first page checked
    ]);
    
    let pricelist= all.filter((v)=> v!== null)
    .filter((v)=> !isNaN(v.price) && wordcount(query,v.name));
    pricelist.sort((a,b)=> a.price- b.price)
    .sort((a,b)=>wordcount(query,b.name)-wordcount(query,a.name));//weighted sort
    console.table(pricelist);
}
compare(myArgs[0]);
//show("gt 1030");