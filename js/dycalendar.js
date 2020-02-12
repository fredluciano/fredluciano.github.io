/*!
 * dyCalendar is a JavaScript library for creating Calendar.
 *
 * Author: Yusuf Shakeel
 * https://github.com/yusufshakeel
 *
 * GitHub Link: https://github.com/yusufshakeel/dyCalendarJS
 *
 * MIT license
 * Copyright (c) 2016 Yusuf Shakeel
 *
 * Date: 2014-08-17 sunday
 */
/*! dyCalendarJS | (c) 2016 Yusuf Shakeel | https://github.com/yusufshakeel/dyCalendarJS */
(function (global) {

    "use strict";

    var
        //this will be used by the user.
        dycalendar = {},

        //window document
        document = global.document,

        //starting year
        START_YEAR = 1900,

        //end year
        END_YEAR = 9999,

        //name of the months
        monthName = {
            full: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            mmm: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        //name of the days
        dayName = {
            full: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
            d: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
            dd: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
            ddd: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        },
        respostas = {
            NEUTRO: 0, SIM: 1, NAO: 2, MISTO: 3
        };

    var nomes = ["Geral","Adriano", "Betão", "Fernando", "Fred Dutra", "Fred Luciano", "Paulão"];
        
    var valores = new Array();

    for (let indicePessoa = 0; indicePessoa < nomes.length; indicePessoa++) {
        valores[indicePessoa] = new Array();
        for (let indiceMes = 0; indiceMes < 12; indiceMes++) {
            valores[indicePessoa][indiceMes] = new Array();
            for (let indiceDia = 0; indiceDia <= 31; indiceDia++) {
                valores[indicePessoa][indiceMes][indiceDia] = respostas.NEUTRO;   
            }                
        }            
    }

    retrieveData();
    
    /**
     * this function will create month table.
     *
     * @param object data   this contains the calendar data
     * @param object option this is the settings object
     * @return html
     */
    function createMonthTable(data, option) {
                
        var
            table, tr, td,
            r, c, count,
            dia, mes, pessoa, resposta;

        table = document.createElement("table");
        tr = document.createElement("tr");

        pessoa = option.pessoa;

        //create 1st row for the day letters
        for (c = 0; c <= 6; c = c + 1) {
            td = document.createElement("td");
            if ((pessoa == 0)&&((c == 0)||(c == 4))) td.setAttribute("class", "dycalendar-dia-destacado");
            td.innerHTML = "DSTQQSS"[c];
            tr.appendChild(td);
        }
        table.appendChild(tr);

        //create 2nd row for dates
        tr = document.createElement("tr");

        //blank td
        for (c = 0; c <= 6; c = c + 1) {
            if (c === data.firstDayIndex) {
                break;
            }
            td = document.createElement("td");
            if ((pessoa == 0)&&((c == 0)||(c == 4))) td.setAttribute("class", "dycalendar-dia-destacado");
            tr.appendChild(td);
        }

        //remaing td of dates for the 2nd row
        count = 1;
        while (c <= 6) {
            td = document.createElement("td");
            dia = count;
            mes = option.month;
            pessoa = option.pessoa;
            resposta = valores[pessoa][mes][dia];
            
            if ((pessoa == 0)&&((c == 0)||(c == 4))) td.setAttribute("class", "dycalendar-dia-destacado");
            td.appendChild(criaBotaoDia(dia, mes, pessoa, resposta));
            tr.appendChild(td);
            count = count + 1;
            c = c + 1;
        }
        table.appendChild(tr);

        //create remaining rows
        for (r = 3; r <= 7; r = r + 1) {
            tr = document.createElement("tr");
            for (c = 0; c <= 6; c = c + 1) {
                if (count > data.totaldays) {
                    table.appendChild(tr);
                    return table;
                }
                td = document.createElement('td');
                dia = count;
                mes = option.month;
                pessoa = option.pessoa;
                resposta = valores[pessoa][mes][dia];
                
                if ((pessoa == 0)&&((c == 0)||(c == 4))) td.setAttribute("class", "dycalendar-dia-destacado");
                td.appendChild(criaBotaoDia(dia, mes, pessoa, resposta));
                
                tr.appendChild(td);
                count = count + 1;
            }
            table.appendChild(tr);
        }

        return table;
    }

    function criaBotaoDia(dia, mes, pessoa, resposta) {
        var button = document.createElement("button");
        button.appendChild(document.createTextNode(dia));
        button.setAttribute("id", pessoa + String(mes).padStart(2, '0') + String(dia).padStart(2, '0'));
        //if (pessoa == 0) button.appendChild(criaToolTip(dia, mes, pessoa));
        
        defineBotaoDia(button, resposta, dia, mes, pessoa);
        
        return button;
    }

    function criaToolTip(dia, mes, pessoa) {
        var tooltip = document.createElement("span");
        tooltip.setAttribute("class", "dycalendar-dayButton-tooltiptext");
        tooltip.setAttribute("id", "tooltip" + pessoa + String(mes).padStart(2, '0') + String(dia).padStart(2, '0'));
        tooltip.appendChild(document.createTextNode("teste tooltip"));
        return tooltip;
    }


    function defineBotaoDia(button, resposta, dia, mes, pessoa) {
        
        button.setAttribute("class", "dycalendar-dayButton-neutral");
        if (pessoa == 0) button.setAttribute("class", "dycalendar-dayButton-neutral-cabecalho");
        if (resposta === respostas.SIM) {
            button.setAttribute("class", "dycalendar-dayButton-yes");
            if (pessoa == 0) button.setAttribute("class", "dycalendar-dayButton-yes-cabecalho");
        }
        if (resposta === respostas.NAO) {
            button.setAttribute("class", "dycalendar-dayButton-no");
            if (pessoa == 0) button.setAttribute("class", "dycalendar-dayButton-no-cabecalho");
        }
        if (resposta === respostas.MISTO) {
            button.setAttribute("class", "dycalendar-dayButton-mixed");
            if (pessoa == 0) button.setAttribute("class", "dycalendar-dayButton-mixed-cabecalho");
        }
        button.setAttribute("dia", dia);
        button.setAttribute("mes", mes);
        button.setAttribute("pessoa", pessoa);
        button.setAttribute("resposta", resposta);
    }
    
    function clicaBotaoDia(button) {
        var resposta = button.getAttribute("resposta");
        resposta = proximaResposta(resposta);
        var dia = button.getAttribute("dia");
        var mes = button.getAttribute("mes");
        var pessoa = button.getAttribute("pessoa");
        
        defineBotaoDia(button, resposta, dia, mes, pessoa);
        valores[pessoa][mes][dia] = resposta;
        calculaConsolidado(dia, mes);
        exibeNovosValores(dia, mes);
        gravaNovosValores(dia, mes, pessoa);
    }

    function proximaResposta(resposta) {

        if (resposta == respostas.NEUTRO) return respostas.SIM;
        if (resposta == respostas.SIM) return respostas.NAO;
        if (resposta == respostas.NAO) return respostas.NEUTRO;
        return respostas.NEUTRO;
    }

    function calculaConsolidado(dia, mes) {
        var resposta;

        var listaRespostas = new Array();
        listaRespostas[respostas.NEUTRO] = 0;
        listaRespostas[respostas.SIM] = 0;
        listaRespostas[respostas.NAO] = 0;

        for (let pessoa = 1; pessoa < nomes.length; pessoa++) {
            resposta = valores[pessoa][mes][dia];
            listaRespostas[resposta]++;   
        }

        valores[0][mes][dia] = respostas.MISTO;

        if ((listaRespostas[respostas.NAO] >= 2)) {
            valores[0][mes][dia] = respostas.NAO;
        }

        if ((listaRespostas[respostas.SIM] >= (nomes.length -2 ))) {
            valores[0][mes][dia] = respostas.SIM;
        }

        if ((listaRespostas[respostas.NEUTRO] == (nomes.length - 1))) {
            valores[0][mes][dia] = respostas.NEUTRO;
        }

    }

    function exibeNovosValores(dia, mes) {
        var botao = document.getElementById(0 + String(mes).padStart(2, '0') + String(dia).padStart(2, '0'));
        var resposta = valores[0][mes][dia];
        botao.setAttribute("class", "dycalendar-dayButton-neutral-cabecalho");
        if (resposta === respostas.SIM)
            botao.setAttribute("class", "dycalendar-dayButton-yes-cabecalho");
        if (resposta === respostas.NAO)
            botao.setAttribute("class", "dycalendar-dayButton-no-cabecalho");
        if (resposta === respostas.MISTO)
            botao.setAttribute("class", "dycalendar-dayButton-mixed-cabecalho");
    }


    function gravaNovosValores(dia, mes, pessoa) {
        var valoresAGravar = new Array();
        valoresAGravar[0] = new Array();
        valoresAGravar[1] = new Array();
        for (let dia = 0; dia <= 31; dia++) {
            valoresAGravar[0][valores[0][mes][dia]] = (valoresAGravar[0][valores[0][mes][dia]] == undefined? '' : valoresAGravar[0][valores[0][mes][dia]] + ",") + dia;
            valoresAGravar[1][valores[pessoa][mes][dia]] = (valoresAGravar[1][valores[pessoa][mes][dia]] == undefined? '' : valoresAGravar[1][valores[pessoa][mes][dia]] + ",") + dia;
        }
        var linhaPessoa = Number(pessoa) + 1;
        var rangesValues = [valoresAGravar[0].join(";"), valoresAGravar[1].join(";")]
        var ranges = [[1, Number(mes) + 1],[linhaPessoa, Number(mes) + 1]];

        writeData(ranges, rangesValues);
    }

    /**
     * this function will draw Calendar Month Table
     *
     * @param object data   this contains the calendar data
     * @param object option this is the settings object
     * @return html
     */
    function drawCalendarMonthTable(data, option) {
        
        var
            table,
            div, container, elem;

        //get table
        table = createMonthTable(data, option);

        //calendar container
        container = document.createElement("div");
        container.setAttribute("class", "dycalendar-month-container");

        //-------------------------- Header ------------------

        //header div
        div = document.createElement("div");
        div.setAttribute("class", "dycalendar-header");
        div.setAttribute("data-option", JSON.stringify(option));

        //prev button
        if (option.prevnextbutton === "show") {
            elem = document.createElement("span");
            elem.setAttribute("class", "dycalendar-prev-next-btn prev-btn");
            elem.setAttribute("data-date", option.date);
            elem.setAttribute("data-month", option.month);
            elem.setAttribute("data-year", option.year);
            elem.setAttribute("data-btn", "prev");
            elem.innerHTML = "&lt;";
            //add prev button span to header div
            div.appendChild(elem);
        }

        //month span
        elem = document.createElement("span");
        elem.setAttribute("class", "dycalendar-span-month-year");
        if (option.monthformat === "mmm") {
            elem.innerHTML = data.monthName + " " + data.year;
        } else if (option.monthformat === "full") {
            elem.innerHTML = data.monthNameFull + " " + data.year;
        }
        
        //add month span to header div
        div.appendChild(elem);

        //next button
        if (option.prevnextbutton === "show") {
            elem = document.createElement("span");
            elem.setAttribute("class", "dycalendar-prev-next-btn next-btn");
            elem.setAttribute("data-date", option.date);
            elem.setAttribute("data-month", option.month);
            elem.setAttribute("data-year", option.year);
            elem.setAttribute("data-btn", "next");
            elem.innerHTML = "&gt;";
            //add prev button span to header div
            div.appendChild(elem);
        }

        //add header div to container
        container.appendChild(div);

        //-------------------------- Body ------------------

        //body div
        div = document.createElement("div");
        div.setAttribute("class", "dycalendar-body");
        div.appendChild(table);

        //add body div to container div
        container.appendChild(div);

        //return container
        return container;
    }

    /**
     * this function will draw Calendar Day
     *
     * @param object data   this contains the calendar data
     * @param object option this is the settings object
     * @return html
     */
    function drawCalendarDay(data, option) {

        var
            div, container, elem;

        //calendar container
        container = document.createElement("div");
        container.setAttribute("class", "dycalendar-day-container");

        //-------------------------- Header ------------------

        //header div
        div = document.createElement("div");
        div.setAttribute("class", "dycalendar-header");

        //day span
        elem = document.createElement("span");
        elem.setAttribute("class", "dycalendar-span-day");
        if (option.dayformat === "ddd") {
            elem.innerHTML = dayName.ddd[data.targetedDayIndex];
        } else if (option.dayformat === "full") {
            elem.innerHTML = dayName.full[data.targetedDayIndex];
        }

        //add day span to footer div
        div.appendChild(elem);

        //add header div to container
        container.appendChild(div);

        //-------------------------- Body ------------------

        //body div
        div = document.createElement("div");
        div.setAttribute("class", "dycalendar-body");

        //date span
        elem = document.createElement("span");
        elem.setAttribute("class", "dycalendar-span-date");
        elem.innerHTML = data.date;

        //add date span to body div
        div.appendChild(elem);

        //add body div to container
        container.appendChild(div);

        //-------------------------- Footer ------------------

        //footer div
        div = document.createElement("div");
        div.setAttribute("class", "dycalendar-footer");

        //month span
        elem = document.createElement("span");
        elem.setAttribute("class", "dycalendar-span-month-year");
        if (option.monthformat === "mmm") {
            elem.innerHTML = data.monthName + " " + data.year;
        } else if (option.monthformat === "full") {
            elem.innerHTML = data.monthNameFull + " " + data.year;
        }

        //add month span to footer div
        div.appendChild(elem);

        //add footer div to container
        container.appendChild(div);

        //return container
        return container;
    }

    /**
     * this function will extend source object with defaults object.
     *
     * @param object source     this is the source object
     * @param object defaults   this is the default object
     * @return object
     */
    function extendSource(source, defaults) {
        var property;
        for (property in defaults) {
            if (source.hasOwnProperty(property) === false) {
                source[property] = defaults[property];
            }
        }
        return source;
    }

    /**
     * This function will return calendar detail.
     *
     * @param integer year        1900-9999 (optional) if not set will consider
     *                          the current year.
     * @param integer month        0-11 (optional) 0 = Jan, 1 = Feb, ... 11 = Dec,
     *                          if not set will consider the current month.
     * @param integer date      1-31 (optional)
     * @return boolean|object    if error return false, else calendar detail
     */
    function getCalendar(year, month, date) {

        var
            dateObj = new Date(),
            dateString,
            result = {},
            idx;

        if (year < START_YEAR || year > END_YEAR) {
            global.console.error("Invalid Year");
            return false;
        }
        if (month > 11 || month < 0) {
            global.console.error("Invalid Month");
            return false;
        }
        if (date > 31 || date < 1) {
            global.console.error("Invalid Date");
            return false;
        }

        result.year = year;
        result.month = month;
        result.date = date;

        //today
        result.today = {};
        dateString = dateObj.toString().split(" ");

        idx = dayName.ddd.indexOf(dateString[0]);
        result.today.dayIndex = idx;
        result.today.dayName = dateString[0];
        result.today.dayFullName = dayName.full[idx];

        idx = monthName.mmm.indexOf(dateString[1]);
        result.today.monthIndex = idx;
        result.today.monthName = dateString[1];
        result.today.monthNameFull = monthName.full[idx];

        result.today.date = dateObj.getDate();

        result.today.year = dateString[3];

        //get month-year first day
        dateObj.setDate(1);
        dateObj.setMonth(month);
        dateObj.setFullYear(year);
        dateString = dateObj.toString().split(" ");

        idx = dayName.ddd.indexOf(dateString[0]);
        result.firstDayIndex = idx;
        result.firstDayName = dateString[0];
        result.firstDayFullName = dayName.full[idx];
        
        idx = monthName.mmm.indexOf(dateString[1]);
        result.monthIndex = idx;
        result.monthName = dateString[1];
        result.monthNameFull = monthName.full[idx];
        
        //get total days for the month-year
        dateObj.setFullYear(year);
        dateObj.setMonth(month + 1);
        dateObj.setDate(0);
        result.totaldays = dateObj.getDate();

        //get month-year targeted date
        dateObj.setFullYear(year);
        dateObj.setMonth(month);
        dateObj.setDate(date);
        dateString = dateObj.toString().split(" ");

        idx = dayName.ddd.indexOf(dateString[0]);
        result.targetedDayIndex = idx;
        result.targetedDayName = dateString[0];
        result.targetedDayFullName = dayName.full[idx];
        
        return result;

    }

    /**
     * this function will handle the on click event.
     */
    function onClick() {

        document.body.onclick = function (e) {

            //get event object (window.event for IE compatibility)
            e = global.event || e;

            var
                //get target dom object reference
                targetDomObject = e.target || e.srcElement,

                //other variables
                date, month, year, btn, option, dateObj;

            //prev-next button click
            //extra checks to make sure object exists and contains the class of interest
            if ((targetDomObject) && (targetDomObject.classList) && (targetDomObject.classList.contains("dycalendar-prev-next-btn"))) {
                date = parseInt(targetDomObject.getAttribute("data-date"));
                month = parseInt(targetDomObject.getAttribute("data-month"));
                year = parseInt(targetDomObject.getAttribute("data-year"));
                btn = targetDomObject.getAttribute("data-btn");
                option = JSON.parse(targetDomObject.parentElement.getAttribute("data-option"));

                if (btn === "prev") {
                    month = month - 1;
                    if (month < 0) {
                        year = year - 1;
                        month = 11;
                    }
                }
                else if (btn === "next") {
                    month = month + 1;
                    if (month > 11) {
                        year = year + 1;
                        month = 0;
                    }
                }

                option.date = date;
                option.month = month;
                option.year = year;

                drawCalendar(option);
            }

            //month click
            //extra checks to make sure object exists and contains the class of interest
            if ((targetDomObject) && (targetDomObject.classList) && (targetDomObject.classList.contains("dycalendar-span-month-year"))) {
                option = JSON.parse(targetDomObject.parentElement.getAttribute("data-option"));
                dateObj = new Date();

                option.date = dateObj.getDate();
                option.month = dateObj.getMonth();
                option.year = dateObj.getFullYear();

                drawCalendar(option);
            }
            
            if ((targetDomObject) && (targetDomObject.classList) && (
                    (targetDomObject.classList.contains("dycalendar-dayButton-neutral")) ||
                    (targetDomObject.classList.contains("dycalendar-dayButton-yes")) ||
                    (targetDomObject.classList.contains("dycalendar-dayButton-no"))            
                )) {
                
                if (targetDomObject.getAttribute("pessoa") != 0) {
                    clicaBotaoDia(targetDomObject);
                } 
            }


        };
    }

    function onload() {

        document.body.onload = function (e) {
            //geraCalendarios();
            //retrieveData(geraCalendarios());
            //writeData();
        }
    }

    //------------------------------ dycalendar.draw() ----------------------

    /**
     * this function will draw the calendar based on user preferences.
     *
     * option = {
     *  target : "#id|.class"   //(mandatory) for id use #id | for class use .class
     *  type : "calendar-type"  //(optional) values: "day|month" (default "day")
     *  month : "integer"       //(optional) value 0-11, where 0 = January, ... 11 = December (default current month)
     *  year : "integer"        //(optional) example 1990. (default current year)
     *  date : "integer"        //(optional) example 1-31. (default current date)
     *  monthformat : "full"    //(optional) values: "mmm|full" (default "full")
     *  dayformat : "full"      //(optional) values: "ddd|full" (default "full")
     *  highlighttoday : boolean    //(optional) (default false) if true will highlight today's date
     *  highlighttargetdate : boolean   //(optional) (default false) if true will highlight targeted date of the month year
     *  highlighttargetdateyes : boolean   //(optional) (default false) if true will highlight green targeted date of the month year
     *  highlighttargetdateno : boolean   //(optional) (default false) if true will highlight red targeted date of the month year
     *  prevnextbutton : "hide"         //(optional) (default "hide") (values: "show|hide") if set to "show" it will show the nav button (prev|next)
     * }
     *
     * @param object option     user preferences
     * @return boolean          true if success, false otherwise
     */
    function draw(option) {

        //check if option is passed or not
        if (typeof option === "undefined") {
            global.console.error("Option missing");
            return false;
        }
        
        var
            self = this,    //pointing at dycalendar object

            dateObj = new Date(),

            //default settings
            defaults = {
                type: "day",
                month: dateObj.getMonth(),
                year: dateObj.getFullYear(),
                date: dateObj.getDate(),
                monthformat: "full",
                dayformat: "full",
                highlighttoday: false,
                highlighttargetdate: false,
                highlighttargetdateyes: false,
                highlighttargetdateno: false,
                prevnextbutton: "hide"
            };

        //extend user options with predefined options
        option = extendSource(option, defaults);

        drawCalendar(option);

    };

    //------------------------------ dycalendar.draw() ends here ------------

    /**
     * this function will draw the calendar inside the target container.
     */
    function drawCalendar(option) {

        var
            //variables for creating calendar
            calendar,
            calendarHTML,
            targetElem,

            //other variables
            i, len, elemArr;

        targetElem = option.target;
        
        //get calendar detail
        calendar = getCalendar(option.year, option.month, option.date);
        //get calendar html
        calendarHTML = drawCalendarMonthTable(calendar, option);

        //draw calendar
        targetElem.innerHTML = calendarHTML.outerHTML;
    }


    function geraCalendarios() {
        
        var celula, calendario, tabela, linha;
        var indiceNome, indiceMes;
        tabela = document.getElementById("tabelaCalendarios");

        for (indiceNome = 0; indiceNome < nomes.length; indiceNome++) {
            linha = document.createElement("tr");
            linha.setAttribute("id", "linhaCalendarios" + indiceNome);
            linha.setAttribute("class", "tabela-calendarios-linha");

            celula = document.createElement("td");
            celula.setAttribute("class", "tabela-calendarios-nome");
            
            if (indiceNome == 0) {
                linha.setAttribute("class", "tabela-calendarios-linha-cabecalho");
                celula = document.createElement("th");
                celula.setAttribute("class", "tabela-calendarios-nome-cabecalho");
            }
            
            celula.appendChild(document.createTextNode(nomes[indiceNome]));
            linha.appendChild(celula);
            
            for (indiceMes = 0; indiceMes < 12; indiceMes++) {
                celula = document.createElement("td");
                celula.setAttribute("class", "tabela-calendarios-celula");
                if (indiceNome == 0) {
                    celula = document.createElement("th");
                    celula.setAttribute("class", "tabela-calendarios-celula-cabecalho");
                }
                calendario = document.createElement("div");
                calendario.setAttribute("id", "calendario" + indiceMes);
                celula.appendChild(calendario);
                linha.appendChild(celula);
                            
                draw({
                    target: calendario,
                    type: "month",
                    year: 2020,
                    month: indiceMes,
                    pessoa: indiceNome
                });           
            }
            
            tabela.appendChild(linha);
        }

    }




    //events
    onload();
    onClick();

    //attach to global window object
    global.dycalendar = dycalendar;



    function retrieveData() {
        
        var range = "Dados!A2:M" + (nomes.length + 1);
     
        var gs_sid = '12ot_Wbhk1VmJn5UutzR69oRH42tmLL_-3by5zIw_n4E'; // Enter your Google Sheet ID here
        var gs_clid = '100883981961-e2btj6pveo11eg212a6ub3svk067fb41.apps.googleusercontent.com'; // Enter your API Client ID here
        var gs_clis = '-iAFcDXR2w8z79dgQ8TQeMDy'; // Enter your API Client Secret here
        var gs_rtok = '1//0hif88CuOj8rJCgYIARAAGBESNwF-L9Ir9sFB5W5JSpxQPx8SOx2rTAc9gy0H6TEeIATxPBHEVtKU_Qn_sb6yCyLjO8kmx4xivuQ'; // Enter your OAuth Refresh Token here
        var gs_atok = false;
        var gs_url = 'https://sheets.googleapis.com/v4/spreadsheets/'+gs_sid+'/values/'+range;
        var gs_body = '';

         // HTTP Request Token Refresh
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://www.googleapis.com/oauth2/v4/token?client_id='+gs_clid+'&client_secret='+gs_clis+'&refresh_token='+gs_rtok+'&grant_type=refresh_token');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
 
        xhr.onload = function() {            
            var response = JSON.parse(xhr.responseText);
            var gs_atok = response.access_token;       
            
            //HTTP Request Append Data
            if(gs_atok) {
                var xxhr = new XMLHttpRequest();
                xxhr.open('GET', gs_url);
                xxhr.setRequestHeader('Content-type', 'application/json');
                xxhr.setRequestHeader('Authorization', 'OAuth ' + gs_atok );
                xxhr.onload = function() {
                    processaDadosPlanilha(JSON.parse(this.response));  
                    geraCalendarios();
                  };
                xxhr.send();
            }       
        };
        xhr.send();
        

    }

    function writeData(ranges, rangesValues) {
        var range = "A8:C8";
        var gs_sid = '12ot_Wbhk1VmJn5UutzR69oRH42tmLL_-3by5zIw_n4E'; // Enter your Google Sheet ID here
        var gs_clid = '100883981961-e2btj6pveo11eg212a6ub3svk067fb41.apps.googleusercontent.com'; // Enter your API Client ID here
        var gs_clis = '-iAFcDXR2w8z79dgQ8TQeMDy'; // Enter your API Client Secret here
        var gs_rtok = '1//0hif88CuOj8rJCgYIARAAGBESNwF-L9Ir9sFB5W5JSpxQPx8SOx2rTAc9gy0H6TEeIATxPBHEVtKU_Qn_sb6yCyLjO8kmx4xivuQ'; // Enter your OAuth Refresh Token here
        var gs_atok = false;
        //var gs_url = 'https://sheets.googleapis.com/v4/spreadsheets/'+gs_sid+'/values/A1:append?includeValuesInResponse=false&insertDataOption=INSERT_ROWS&responseDateTimeRenderOption=SERIAL_NUMBER&responseValueRenderOption=FORMATTED_VALUE&valueInputOption=USER_ENTERED';
        //var gs_url = 'https://sheets.googleapis.com/v4/spreadsheets/'+gs_sid+'/values/A1?includeValuesInResponse=false&responseDateTimeRenderOption=SERIAL_NUMBER&responseValueRenderOption=FORMATTED_VALUE&valueInputOption=USER_ENTERED';
        //var gs_url = 'https://sheets.googleapis.com/v4/spreadsheets/'+gs_sid+'/values/A2:batchUpdate?includeValuesInResponse=false&responseDateTimeRenderOption=SERIAL_NUMBER&responseValueRenderOption=FORMATTED_VALUE&valueInputOption=USER_ENTERED';
        //var gs_url = 'https://sheets.googleapis.com/v4/spreadsheets/'+gs_sid+'/values/A1:D5:clear';
        var gs_url = 'https://sheets.googleapis.com/v4/spreadsheets/'+gs_sid+':batchUpdate';
        //var gs_body = '{"majorDimension":"ROWS", "values":[['+row+']]}';        
        //var gs_body = '{"range":"A8:C8", "majorDimension":"ROWS", "values":[['+row+']]}';        
        //var gs_body = '{"majorDimension":"ROWS", "values":[['+'"9","10","11","12"'+']]}';        
        // var gs_body = {
        //     valueInputOption: "USER_ENTERED",
        //     data: [
        //         {
        //             range: "Dados!" + ranges[0],
        //             values: [[[rangesValues[0]]]]
        //         },
        //         {
        //             range: "Dados!" + ranges[1],
        //             values: [[[rangesValues[1]]]]
        //         }
        //     ],
        //     includeValuesInResponse: false,
        //     responseValueRenderOption: "FORMATTED_VALUE",
        //     responseDateTimeRenderOption: "SERIAL_NUMBER"
        // };

        // var gs_body = {
        //     valueInputOption: "USER_ENTERED",
        //     data: [
        //         {
        //             range: "A1:A3",
        //             values: [["1","2","3"]]
        //         }
        //     ],
        //     includeValuesInResponse: false,
        //     responseValueRenderOption: "FORMATTED_VALUE",
        //     responseDateTimeRenderOption: "SERIAL_NUMBER"
        // };

        // gs_body = JSON.stringify(gs_body);

        
        var gs_body = JSON.stringify({
            requests: [{
              repeatCell: {
                range: {
                  startColumnIndex: ranges[0][1],
                  endColumnIndex: Number(ranges[0][1]) + 1,
                  startRowIndex: ranges[0][0],
                  endRowIndex: Number(ranges[0][0]) + 1,
                  sheetId: 770694312
                },
                cell: {
                  userEnteredValue: {
                    "stringValue": rangesValues[0]
                  },
                },
                fields: "*"
              }
            },
            {
            repeatCell: {
                range: {
                    startColumnIndex: ranges[1][1],
                    endColumnIndex: Number(ranges[1][1]) + 1,
                    startRowIndex: ranges[1][0],
                    endRowIndex: Number(ranges[1][0]) + 1,
                    sheetId: 770694312
                },
                cell: {
                  userEnteredValue: {
                    "stringValue": rangesValues[1]
                  },
                },
                fields: "*"
              }
            }
            ]
          });
          
         // HTTP Request Token Refresh
         var xhr = new XMLHttpRequest();
         xhr.open('POST', 'https://www.googleapis.com/oauth2/v4/token?client_id='+gs_clid+'&client_secret='+gs_clis+'&refresh_token='+gs_rtok+'&grant_type=refresh_token');
         xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
         
         xhr.onload = function() {            
             var response = JSON.parse(xhr.responseText);
             var gs_atok = response.access_token;            
             // HTTP Request Append Data
             if(gs_atok) {
                 var xxhr = new XMLHttpRequest();
                 xxhr.open('POST', gs_url);
                 xxhr.setRequestHeader('Content-type', 'application/json');
                 xxhr.setRequestHeader('Authorization', 'OAuth ' + gs_atok );
                 xxhr.onload = function() {
                     if(xxhr.status == 200) {
                         // Success
                         $('#message').html('<p>Row Added to Sheet | <a href="http://snydergroupinc.com/tutorials/tutorial-google-sheets-api.php">Add Another &raquo;</a></p><p>Response:<br/>'+xxhr.responseText+'</p>');
                         } else {
                         // Fail
                         $('#message').html('<p>Row Not Added</p><p>Response:<br/>'+xxhr.responseText+'</p>');
                     }
                 };
                 xxhr.send(gs_body);
             }            
         };
         xhr.send();

    }

    function teste() {


        var row = '"9","10","11","12"';
        


        var gs_sid = '12ot_Wbhk1VmJn5UutzR69oRH42tmLL_-3by5zIw_n4E'; // Enter your Google Sheet ID here
        var gs_clid = '100883981961-e2btj6pveo11eg212a6ub3svk067fb41.apps.googleusercontent.com'; // Enter your API Client ID here
        var gs_clis = '-iAFcDXR2w8z79dgQ8TQeMDy'; // Enter your API Client Secret here
        var gs_rtok = '1//0hif88CuOj8rJCgYIARAAGBESNwF-L9Ir9sFB5W5JSpxQPx8SOx2rTAc9gy0H6TEeIATxPBHEVtKU_Qn_sb6yCyLjO8kmx4xivuQ'; // Enter your OAuth Refresh Token here
        var gs_atok = false;
        //var gs_url = 'https://sheets.googleapis.com/v4/spreadsheets/'+gs_sid+'/values/A1:append?includeValuesInResponse=false&insertDataOption=INSERT_ROWS&responseDateTimeRenderOption=SERIAL_NUMBER&responseValueRenderOption=FORMATTED_VALUE&valueInputOption=USER_ENTERED';
        //var gs_url = 'https://sheets.googleapis.com/v4/spreadsheets/'+gs_sid+'/values/A1?includeValuesInResponse=false&responseDateTimeRenderOption=SERIAL_NUMBER&responseValueRenderOption=FORMATTED_VALUE&valueInputOption=USER_ENTERED';
        //var gs_url = 'https://sheets.googleapis.com/v4/spreadsheets/'+gs_sid+'/values/A2:batchUpdate?includeValuesInResponse=false&responseDateTimeRenderOption=SERIAL_NUMBER&responseValueRenderOption=FORMATTED_VALUE&valueInputOption=USER_ENTERED';
        var gs_url = 'https://sheets.googleapis.com/v4/spreadsheets/'+gs_sid+'/values/A1:D5:clear';
        //var gs_body = '{"majorDimension":"ROWS", "values":[['+row+']]}';        
        //var gs_body = '{"range":"A1:A4", "majorDimension":"ROWS", "values":[['+row+']]}';        
        var gs_body = '';        
        
         // HTTP Request Token Refresh
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://www.googleapis.com/oauth2/v4/token?client_id='+gs_clid+'&client_secret='+gs_clis+'&refresh_token='+gs_rtok+'&grant_type=refresh_token');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        //xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.onload = function() {            
            var response = JSON.parse(xhr.responseText);
            var gs_atok = response.access_token;            
			// HTTP Request Append Data
            if(gs_atok) {
                var xxhr = new XMLHttpRequest();
                xxhr.open('POST', gs_url);
                xxhr.setRequestHeader('Content-length', gs_body.length);
                xxhr.setRequestHeader('Content-type', 'application/json');
                xxhr.setRequestHeader('Authorization', 'OAuth ' + gs_atok );
                xxhr.onload = function() {
					if(xxhr.status == 200) {
						// Success
						$('#message').html('<p>Row Added to Sheet | <a href="http://snydergroupinc.com/tutorials/tutorial-google-sheets-api.php">Add Another &raquo;</a></p><p>Response:<br/>'+xxhr.responseText+'</p>');
						} else {
						// Fail
						$('#message').html('<p>Row Not Added</p><p>Response:<br/>'+xxhr.responseText+'</p>');
					}
                };
                xxhr.send(gs_body);
            }            
        };
        xhr.send();


        


        /* 
        // Create a request variable and assign a new XMLHttpRequest object to it.
        var request = new XMLHttpRequest()

        // Open a new connection, using the GET request on the URL endpoint
        //request.open('GET', 'https://ghibliapi.herokuapp.com/films', true)

        //request.open('GET', 'https://sheets.googleapis.com/v4/spreadsheets/12ot_Wbhk1VmJn5UutzR69oRH42tmLL_-3by5zIw_n4E?ranges=Dados!A1:C5&fields=sheets(data.rowData.values(effectiveValue))&key=AIzaSyDLxoe7rCBuyIBCUUGdTm5C_fFnBr6o50o', true);
        //request.open('GET', 'https://sheets.googleapis.com/v4/spreadsheets/spreadsheetId/values/Dados!A1:C5&key=AIzaSyDLxoe7rCBuyIBCUUGdTm5C_fFnBr6o50o', true);

        //request.open('GET', 'https://sheets.googleapis.com/v4/spreadsheets/12ot_Wbhk1VmJn5UutzR69oRH42tmLL_-3by5zIw_n4E/values/Dados!A2:D5?key=AIzaSyDLxoe7rCBuyIBCUUGdTm5C_fFnBr6o50o', true);
        request.open('PUT', 'https://sheets.googleapis.com/v4/spreadsheets/12ot_Wbhk1VmJn5UutzR69oRH42tmLL_-3by5zIw_n4E/values/Dados!A2:D2?key=AIzaSyDLxoe7rCBuyIBCUUGdTm5C_fFnBr6o50o', true);

        request.open('POST', 'https://sheets.googleapis.com/v4/spreadsheets/12ot_Wbhk1VmJn5UutzR69oRH42tmLL_-3by5zIw_n4E/values/A1:append?insertDataOption=INSERT_ROWS&responseDateTimeRenderOption=SERIAL_NUMBER&responseValueRenderOption=FORMATTED_VALUE&valueInputOption=USER_ENTERED&key=AIzaSyDLxoe7rCBuyIBCUUGdTm5C_fFnBr6o50o', true);

        request.setRequestHeader('Content-type','application/json; charset=utf-8');

        var data = [
            ["1", "2", "3", "4"]
        ];
        var json = JSON.stringify(data);

        request.onload = function() {
            // Begin accessing JSON data here
            // var data = JSON.parse(this.response);

            // data.forEach(movie => {
            // // Log each movie's title
            // console.log(movie.title)
            // });
            console.log(this.response);
            
            
        }

        // Send request
        request.send(json); */
    }

    function processaDadosPlanilha(dados) {
        
        var valoresPlanilha = dados.values;
        var resp, neutro, sim, nao, misto;
        var indiceMes, indiceDia;
        
        //console.log(valoresPlanilha);
        for (let indicePessoa = 0; indicePessoa < nomes.length; indicePessoa++) {
            for (let indiceMesPlanilha = 1; indiceMesPlanilha <= 12; indiceMesPlanilha++) {
                indiceMes = indiceMesPlanilha -1;
                resp = '';
                neutro = '';
                sim = '';
                nao = '';
                misto = '';
                if (
                        (valoresPlanilha !== undefined)&&
                        ((indicePessoa <= valoresPlanilha.length)&&(valoresPlanilha[indicePessoa] !== undefined))&&
                        ((indiceMesPlanilha <= valoresPlanilha[indicePessoa].length)&&(valoresPlanilha[indicePessoa][indiceMesPlanilha] !== undefined))&&
                        (valoresPlanilha[indicePessoa][indiceMesPlanilha] !== undefined)
                    ) 
                        resp = (valoresPlanilha[indicePessoa][indiceMesPlanilha]).split(";");
                
                if (resp[respostas.NEUTRO] !== undefined) neutro = resp[respostas.NEUTRO].split(",");
                if (resp[respostas.SIM] !== undefined) sim = resp[respostas.SIM].split(",");
                if (resp[respostas.NAO] !== undefined) nao = resp[respostas.NAO].split(",");
                if (resp[respostas.MISTO] !== undefined) misto = resp[respostas.MISTO].split(",");                
                
                for (let indiceDiaPlanilha = 0; indiceDiaPlanilha < 31; indiceDiaPlanilha++) {
                    indiceDia = indiceDiaPlanilha + 1;
                    valores[indicePessoa][indiceMes][indiceDia] = respostas.NEUTRO;

                    for (let index = 0; index < sim.length; index++) {
                        if (sim[index] == indiceDia) valores[indicePessoa][indiceMes][indiceDia] = respostas.SIM;
                    }
                    for (let index = 0; index < nao.length; index++) {
                        if (nao[index] == indiceDia) valores[indicePessoa][indiceMes][indiceDia] = respostas.NAO;
                    }
                    for (let index = 0; index < misto.length; index++) {
                        if (misto[index] == indiceDia) valores[indicePessoa][indiceMes][indiceDia] = respostas.MISTO;
                    }

                }
            }            
        }
    }






}(typeof window !== "undefined" ? window : this));
