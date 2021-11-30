const axios= require("axios");
const cheerio= require("cheerio");
//import {sslRootCAs} from "ssl-root-cas/latest";
//sslRootCAs.inject();

/*interface product{
    price:number,
    name:string,
    link:string
}*/

function universalprice(price, brk){
    if (typeof price == "number")
        return price;
    if (typeof price !== "string")
        return NaN;
    let final="";
    brk= (brk===undefined)? "," : brk;//default character ,
    for (let i=0;i<price.length;i++){
        if (price.charCodeAt(i)>=48 && price.charCodeAt(i)<=57){//ascii code for digits
            final+=price[i];
        }else if (price[i]===brk){// comma reached (only selecting the integer value)
            break;
        }
    }
    return parseInt(final);
}

function lowestprice(arr){
    let min, index;
    min = arr[0].price;
    index=0;
    for(let i=1;i< arr.length;i++){
        if (arr[i].price < min){
            min= arr[i].price;
            index= i;
        }
    }
    return arr[index];
}

async function enter(query){
    try{
        let resp= await axios.get(`https://enter.online/search/?q=${encodeURI(query.replace(" ","+"))}`+
        `&sort_by=price&sort_order=asc&result_ids=pagination_contents`);
        let $=cheerio.load(resp.data);
        let grid =$("#pagination_contents");
        if (grid.length){//if there are items listed
            let item= $(".pm-product").first();
            return {
                price: parseInt(item.parent().find(".pm-main-price ").find(".ty-price-num")
                    .text().replace("lei","").split(" ").join("")),
                name: item.children().eq(2).children("span").text().split("\n").join(""),
                link: item.attr("href")
            };
        } else {
            return null;//no items listed
        }

    }
    catch(e){
        console.log(e);
    }
}

async function neocomputer(query){
    try{
        let resp= await axios.get(`https://neocomputer.md/index.php?route=product/search&sort=`+
            `p.price&order=ASC&search=${encodeURI(query)}`);
        let $= cheerio.load(resp.data);
        if ($(".catalog__settings").length){//items listed
            let item= $(".item ").first();
            return {
                price: parseInt(item.find(".price__current").children("span").text()
                    .replace("lei","").split(" ").join("")),
                name: item.children(".item__title").text(),
                link: item.attr("href")
            };
        }else{// no items listed
            return null;
        }
    }
    catch(e){
        console.log(e);
    }
}

async function matrix(query){
    try{
        let resp= await axios.get(`http://matrix.md/?subcats=Y&pcode_from_q=Y&pshort=Y&pfull=`+
        `Y&pname=Y&pkeywords=Y&search_performed=Y&pshort=N&pfull=N&pname=Y&pkeywords=N&match`+
        `=all&pcode_from_q=Y&pcode=Y&q=${encodeURI(query.split(" ").join("+"))}`+
        `&dispatch=products.search`);
        let $= cheerio.load(resp.data);
        if ($(".ty-no-items").length){//no items warning div
            return null;
        }else{//items listed
            let item= $(".ty-column4").first();
            return {
                price: parseInt(item.find(".ty-grid-list__price ").find(".ty-price-num")
                    .first().text()),
                name: item.find(".ty-grid-list__item-name").children(".product-title")
                    .attr("title"),
                link: item.find(".ty-grid-list__item-name").children(".product-title")
                    .attr("href")
            };
        }
    }
    catch(e){
        console.log(e);
    }
}

async function uno(query){
    try{
        resp=await axios.get(`https://uno.md/search/${encodeURI(query)}?order=price-asc`);
        let $= cheerio.load(resp.data);
        if ($(".product__container").length){//there are items listed
            let item= $(".product__container").first();
            return {
                price: item.find(".product__price__current").attr("content"),
                name: item.find(".product__title").attr("content"),
                link: item.find(".product__title").attr("href")
            };
        }else{
            return null;//no items listed
        }
    }catch(e){
        console.log(e);
    }
}

async function bigshop(query){
    try{
        let resp= await axios.get(`https://bigshop.md/ro/api/search-page?query=`+
            `${encodeURI(query.split(" ").join("+"))}&page=1&sorting=low_to_high`);
        if (resp.data.products.data[0] !== undefined){//response obj has property
            let item=resp.data.products.data[0];
            return {
                price: item.price,
                name: item.full_name,
                link: item.link
            };
        }else{
            return null;
        }
    }catch(e){
        console.log(e);
    }
}

async function itunexx(query){
    try{
        let resp= await axios.get(`https://itunexx.md/ro/componente-pc-si-monitoare/procesoare-`+
            `placi-de-baza-si-placi-video/placa-video/by,product_price/results,1-6?language`+
            `=ro-RO&keyword=${encodeURI(query)}&search=true`);
        let $=cheerio.load(resp.data);
        let item= $(".product-box, .front_w, .spacer  ").first();
        if (item.length){//items listed
            return {
                price: universalprice(item.find(".wrapper-slide").find(".PricesalesPrice")
                    .children().first().text()),
                name: item.find(".Title").children("a").text(),
                link: "https://itunexx.md"+item.find(".Title").children("a").attr("href")
            };
        }else{// no items listed
            return null;
        }
    }catch(e){
        console.log(e);
    }
}

async function doxyterra(query){
    try{
        let resp= await axios.get(`https://doxyterra.md/ro/search?query=${encodeURI(query)}`);
        let $=cheerio.load(resp.data);
        let item=$(".product-item-container").first();
        if (item.length){
            return {
                price: parseInt(item.find(".product__item__price__current").text()
                    .replace("lei","").split(" ").join("")),
                name: item.find(".product__item__info").children("a").attr("title"),
                link: "https://doxyterra.md"+
                    item.find(".product__item__info").children("a").attr("href")
            };
        }else{
            return null;
        }
    }catch(e){
        console.log(e);
    }
}

async function nanoteh(query){
    try{
        let resp= await axios.get(`https://nanoteh.md/ro/?cat=0&q=${encodeURI(query
            .split(" ").join("+"))}`,{

            headers:{
                "Cookie":"LANG=ro; ORDER=price",
                //"Upgrade-Insecure-Requests":1
            }
        });
        let $=cheerio.load(resp.data);
        if ($(".products-grid").length){
            let item=$(".item").first();
            return {
                price: item.find(".special-price").text(),
                name: item.find(".item-title").attr("title"),
                link: item.find(".item-title").attr("href")
            };
        }else{
            return null;
        }
    }catch(e){
        console.log(e);
    }
}

async function hamster(query){
    try{
        let resp= await axios.get("https://www.hamster.md/recordings/toggle/cookie:Shop.order"+
            "/value:price_asc");//for getting cookies
        let cookie= resp.headers["set-cookie"];
        //console.log(resp.headers);
        //console.log(cookie);
        resp= await axios.get(`https://www.hamster.md/shop/shop_item/search/query:`+
            encodeURI(query),{
                headers:{
                    "cookie":cookie
                }
            });
        let $=cheerio.load(resp.data);
        let item=$(".shop_item").first();
        //console.log(item.html());
        if (item.length){
            return {
                price: parseInt(item.find(".price").text().replace("лей","")
                    .split(" ").join("")),
                name: item.find(".title").find("a").text(),
                link: "https://www.hamster.md"+
                    item.find(".title").find("a").attr("href")
            };
        }else{
            return null;
        }
    }catch(e){
        console.log(e);
    }
}

async function cosmo(query){
    try{
        let resp= await axios.get(`https://www.cosmo.md/index.php?route=product/search&sort=p.p`+
            `rice&order=ASC&search=${encodeURI(query.split(" ").join("+"))}`);
        let $=cheerio.load(resp.data);
        let item=$(".product-layout").first();
        if (item.length){
            return {
                price: universalprice(item.find(".price").text()),
                name: item.find(".caption").find("h4 a").text(),
                link: item.find(".caption").find("h4 a").attr("href").replace(
                    `?search=${encodeURI(query)}&sort=p.price&order=ASC`,""
                )
            };
        }else{
            return null;
        }
    }catch(e){
        console.log(e);
    }
}

async function maxmart(query){
    try{
        let resp= await axios.get(`http://www.maxmart.md/ro/produse/?q=`+
            `${encodeURI(query.split(" ").join("+"))}&p=1&s=1`);
        let $=cheerio.load(resp.data);
        let item=$(".card-item").first();
        if (item.length){
            return{
                price: universalprice(item.find(".card-item-cart span").text()),
                name: item.find("figcaption h3 a").text(),
                link: "http://www.maxmart.md"+ item.find("figcaption h3 a").attr("href")
            };
        }else{
            return null;
        }
    }catch(e){
        console.log(e);
    }
}

async function maximum(query){
    try{
        let resp= await axios.get("https://maximum.md/ro/search?query="+ encodeURI(
            query.split(" ").join("+")
        ),{
            headers:{
                "Cookie":"simpalsid.lang=ro;view_type=1;sort_type=cheaper"
            }
        });
        let $=cheerio.load(resp.data);
        let item=$(".wrap_search_page").first();
        if (item.length){
            return {
                price: parseInt(item.find(".product__item__price-current").text()),
                name: item.find(".product__item__title a").text(),
                link: "https://maximum.md"+ item.find(".product__item__title a").attr("href")
            };
        }else{
            return null;
        }
    }catch(e){
        console.log(e);
    }
}

async function gorilla(query){
    try{
        let resp= await axios.get("https://gorilla.md/busca?sort=p.price&order=ASC&search="+
            encodeURI(query));
        let $=cheerio.load(resp.data);
        let item=$(".product").first();
        if(item.length){
            return {
                price: universalprice(item.find(".right .price").text()),
                name: item.find(".right .name a").text(),
                link: item.find(".right .name a").attr("href")
            };
        }else{
            return null;
        }
    }catch(e){
        console.log(e);
    }
}

async function shopit(query){
    try{
        let resp= await axios.get("https://shopit.md/ro/catalog/search/?query="+
            encodeURI(query.split(" ").join("+")));
        let $=cheerio.load(resp.data);
        let items=$("#catalog-items").children(
            ".col-lg-3, .col-md-4, .col-sm-6, .col-xs-4, .col-xxs-6");
        if (items.length){
            let itemlist=items.map((index, v)=>{
                return {
                    price: universalprice($(v).find(".caption .price-new").text(),"."),
                    name: $(v).find(".caption h4 a").attr("title"),
                    link: $(v).find(".caption h4 a").attr("href")
                };
            }).get();
            return lowestprice(itemlist);
            //return itemlist;
        }else{
            return null;
        }
    }catch(e){
        console.log(e);
    }
}

async function darwin(query){
    try{
        let resp= await axios.get("https://darwin.md/search?search="+
            encodeURI(query.split(" ").join("+")));
        let $=cheerio.load(resp.data);
        let items= $(".col-6, .col-md-4, .col-lg-3 figure");
        return items.length;
    }catch(e){
        console.log(e);
    }
}

async function pandashop(query){
    try{
        let resp= await axios.get("https://www.pandashop.md/ro/search/?text="+
            encodeURI(query.split(" ").join("+")));
        let $=cheerio.load(resp.data);
        let items = $(".card-body").not((index, v)=>{
            if ($(v).find(".card-cart").text()=="Stoc epuizat"){
                return true;
            }else{
                return false;
            }
        });
        if (items.length){
            let itemlist = items.map((index, v)=>{
                return {
                    price: universalprice($(v).find(".card-price_curr").text()),
                    name: $(v).find(".card-title, .lnk-inner .lnk-txt").text(),
                    link: "https://www.pandashop.md/"+$(v).
                        find(".card-title, .lnk-inner").attr("href")
                };
            }).get();
            let pages=parseInt($(".cards-total").text())/20 + 1;//total page n
            for (let i=2;i<=pages;i++){
                let resp2= await axios.get(`https://www.pandashop.md/ro/search`+
                `/?page_=page_${i}&Text=`+encodeURI(query.split(" ").join("+")));
                let $=cheerio.load(resp2.data);//loading other pages
                let items2 = $(".card-body").not((index, v)=>{
                    if ($(v).find(".card-cart").text()=="Stoc epuizat"){
                        return true;
                    }else{
                        return false;
                    }
                });
                if (items2.length){
                    let itemlist2=items2.map((index, v)=>{
                        return {
                            price: universalprice($(v).find(".card-price_curr").text()),
                            name: $(v).find(".card-title, .lnk-inner .lnk-txt").text(),
                            link: "https://www.pandashop.md/"+$(v)
                                .find(".card-title, .lnk-inner").attr("href")
                        };
                    }).get();
                    itemlist.push(...itemlist2);
                }else{
                    break;//pages filled with out of stock
                }
            }
            return lowestprice(itemlist);
        }else{
            return null;
        }
    }catch(e){
        console.log(e);
    }
}

async function netmarket(query){
    try{
        resp= await axios.post("https://www.netmarket.md/includes/search_filtru_script.php",{
            s_query_2:"AND+((`titlu_ro`+LIKE+'%"+encodeURI(query.split(" ").join("+"))+
                "%')+OR+(`cod`+LIKE+'"+encodeURI(query.split(" ").join("+"))+
                "')+OR+(`cat1`+LIKE+'%"+encodeURI(query.split(" ").join("+"))+
                "%')+OR+(`cat2`+LIKE+'%"+encodeURI(query.split(" ").join("+"))+
                "%')+OR+(`cat3`+LIKE+'%"+encodeURI(query.split(" ").join("+"))+
                "%')+OR+(`cat4`+LIKE+'%"+encodeURI(query.split(" ").join("+"))+
                "%')+OR+(`brand`+LIKE+'%"+encodeURI(query.split(" ").join("+"))+
                "%')+OR+(`model`+LIKE+'%"+encodeURI(query.split(" ").join("+"))+
                "%')+OR+(`cod_furnizor`+LIKE+'%"+encodeURI(query.split(" ").join("+"))+"%'))",
            id_cat1:"",
            poisk: encodeURI(query.split(" ").join("+")),
            suma: "",
            suma2: "",
            pret_sort: "tobig"
        });
        let $=cheerio.load(resp.data);
        return resp;
    }catch(e){
        console.log(e);
    }
}

async function zap(query){
    try{
        let resp= await axios.get(`https://www.zap.md/search#keys=${encodeURI(query)}`+
            `&tid=All&sort_by=field_current_price_value&sort_order=ASC`);
        let $=cheerio.load(resp.data);
        if ($(".row-1 .col-1").length){
            let item=$(".row-1 .col-1");
            return {
                price: universalprice(item.children(".current-price").text()),
                name: item.find(".views-field-title a").text(),
                link: "https://www.zap.md"+item.find(".views-field-title a").attr("href")
            };
        }else{
            return null;
        }
    }catch(e){
        console.log(e);
    }
}

async function fantastic(query){
    try{
        let resp= await axios.get("https://www.fantastic.md/ro/catalog?search="+encodeURI(query));
        let $=cheerio.load(resp.data);
        let items=$(".Content_Goods_Group .Content_Goods_ItemBlock");
        if(items.length){
            let itemlist = items.map((index, v)=>{
                return {
                    price: universalprice($(v).find(".Content_Goods_PriceBlock_Value_lei")
                        .text()),
                    name: $(v).children(".Content_Goods_TitleBlock").first().children("a")
                        .text(),
                    link: "https://www.fantastic.md"+$(v)
                        .children(".Content_Goods_TitleBlock").first().children("a")
                        .attr("href")
                }
            }).get();
            return lowestprice(itemlist);
        }else{
            return null;
        }
    }catch(e){
        console.log(e);
    }
}

async function smadshop(query){
    try{
        let resp= await axios.get("https://smadshop.md/ro/search/?search="+encodeURI(query));
        let $=cheerio.load(resp.data);
        let items= $(".product-grid").children("div");
        if (items.length){
            let itemlist= items.map((index,v)=>{
                return {
                    price: universalprice($(v).find(".price").text()),
                    name: $(v).find(".name a").attr("title"),
                    link: $(v).find(".name a").attr("href")
                };
            }).get();
            if ($(".results").length){
                let pages= universalprice($(".results").text().substring(
                    $(".results").text().indexOf("(")
                ));
                for (let i=2;i<=pages;i++){
                    let resp2= await axios.get("https://smadshop.md/ro/search/?search="
                        +encodeURI(query)+`&page=${i}`);
                    let $=cheerio.load(resp2.data);
                    let items2= $(".product-grid").children("div");
                    if (items2.length){
                        let itemlist2= items2.map((index,v)=>{
                            return {
                                price: universalprice($(v).find(".price").text()),
                                name: $(v).find(".name a").attr("title"),
                                link: $(v).find(".name a").attr("href")
                            };
                        }).get();
                        itemlist.push(...itemlist2);
                    }
                }
            }
            return lowestprice(itemlist);
        }else{
            return null;
        }
    }catch(e){
        console.log(e);
    }
}

async function electro(query){
    try{
        let resp= await axios.get("http://electro.md/index.php?route=product/search&sort=p.pri"+
        "ce&order=ASC&search="+encodeURI(query.split(" ").join("+")));
        let $=cheerio.load(resp.data);
        let item=$(".caption").first();
        if (item.length){
            return {
                price: universalprice(item.children(".price").text()),
                name: item.find("h4 a").text(),
                link: item.find("h4 a").attr("href")
            };
        }else{
            return null;
        }
    }catch(e){
        console.log(e);
    }
}

async function gsmshop(query){
    try{
        let resp= await axios.get("https://www.gsmshop.md/product/search.html?search="+
            encodeURI(query.split(" ").join("+")));
        let $=cheerio.load(resp.data);
        let items=$(".phone_container").children();
        if (items.length){
            let itemlist= items.map((index,v)=>{
                return {
                    price: universalprice($(v)
                        .children(".phone_bls_price, .notranslate").text()),
                    name: $(v).find(".phone_bls_name a h2").text(),
                    link: "https://www.gsmshop.md"+$(v).find(".phone_bls_name a").attr("href")
                }
            }).get();
            return lowestprice(itemlist);
        }else{
            return null;
        }
    }catch(e){
        console.log(e);
    }
}

async function primepc(query){
    try{
        let resp= await axios.get("https://prime-pc.md/search?searchfield="+
            encodeURI(query.split(" ").join("+")));
        let $=cheerio.load(resp.data);
        let items= $(".price_it").not((index,v)=>{
            return $(v).find(".sticker").text()==="н/д";
        });
        if (items.length== 0)
            return null;
        let itemlist=items.map((index,v)=>{
            return {
                price: universalprice($(v).find(".sticker").text()),
                name: $(v).find(".item_tit").text().replace("\n","").split("\t").join(""),
                link: "https://prime-pc.md"+$(v).children("a").attr("href")
            }
        }).get();
        return lowestprice(itemlist);
    }catch(e){
        console.log(e);
    }
}

async function gig(query){
    try{
        let resp= await axios.get("https://gig.md/ru/search?query="+encodeURI(query.split(" ").join("+")));
        let $=cheerio.load(resp.data);
        let items=$(".product_card_container ").not((index,v)=>{
            return $(v).find(".btn_add_cart .btn_flex span").text().includes("Нет в наличии");
        });
        if (items.length == 0)
            return null;
        let itemlist= items.map((index, v)=>{
            return {
                price: universalprice($(v).find(".product_card_info .product_card_price_current").text()),
                name: $(v).find(".product_card_info .product_card_title").text(),
                link: "https://gig.md"+$(v).find(".product_card_info a").attr("href")
            }
        }).get();
        return lowestprice(itemlist);
    }catch(e){
        console.log(e);
    }
}

async function grandshop(query){
    try{
        let resp= await axios.get("https://grandshop.md/ro/search?query="+
            encodeURI(query.split(" ").join("+")));
        let $=cheerio.load(resp.data);
        let itemcount= universalprice($(".search-title-count").text());
        if (itemcount== 0)
            return null;
        let pages= 1 + Math.floor(itemcount/66);
        let itemlist= [];
        for (let i=1;i<=pages;i++){
            let resp2= await axios.get(`https://grandshop.md/ro/search/${i}?query=`+
                encodeURI(query.split(" ").join("+")));
            let $=cheerio.load(resp2.data);
            let items= $(".js-content, .product-list-item");
            let itemlist2= items.map((index,v)=>{
                return {
                    price: universalprice($(v).find(".product-list-item__price").text()),
                    name: $(v).find(".product-list-item__title").text(),
                    link: "https://grandshop.md"+ $(v).find(".product-list-item__title")
                        .attr("href")
                }
            }).get();
            itemlist.push(...itemlist2);
        }
        return lowestprice(itemlist);
    }catch(e){
        console.log(e);
    }
}

async function u(query){
    try{
        let resp= await axios.get(``);
        let $=cheerio.load(resp.data);
    }catch(e){
        console.log(e);
    }
}

module.exports= {
    enter,
    neocomputer,
    matrix,
    uno,//price sorting broken??
    bigshop,//bad item search
    itunexx,
    doxyterra,
    nanoteh,//ssl certificat probleme
    hamster,
    cosmo,
    maxmart,
    maximum,
    gorilla,
    shopit,
    darwin,//WIP
    pandashop,
    netmarket,
    zap,//bugged? ajax??
    fantastic,
    smadshop,
    electro,
    gsmshop,//only first page checked
    primepc,
    gig,//only first page checked
    grandshop
};