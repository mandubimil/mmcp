var pop_menu =
{ view:"popup",	id:"pop_menu", head:"Submenu", width:150,body:
    {
        type:"space",
        rows:
        [
            {
                view:"list", id:"list_menu", data:[
                                            {id:"1", location:"메모"},
                                            {id:"2", location:"코딩"},
                                            {id:"3", location:"매매일지"},
                                            {id:"5", location:"주식단어분석"},
                                            {id:"4", location:"소설"}
                                        ],
                datatype:"json", template:"#location#",	autoheight:true, select:true
            }
        ]
    }
};

async function getPromise(i) {
	return i;
}

function attach_menu()
{
    $$("list_menu").attachEvent("onItemClick", function(id, e, node){
        if      (id === '1'){location.href = '/memo10';}
        else if (id === '2'){location.href = '/code10';}
        else if (id === '3'){location.href = '/meil10';}
        else if (id === '5'){location.href = '/stw10';}
        else if (id === '4'){location.href = '/novel10';}
    });
}



function tput1(str_temp)
{
	$$('tl1').setHTML(str_temp);
	webix.message(str_temp);
}

function tput2(str_temp, str_bar)
{
	$$('tl1').setHTML(str_bar);

	if (str_temp != 'no_message')
	{
		webix.message(str_temp);
	}
}

function get_obj_list(data)
{
	var str_temp = '';

	if ((typeof data) === 'string')
		str_temp = str_temp + '[string] ' + data;
	if ((typeof data) === 'number')
		str_temp = str_temp + '[number] ' + data;
	else
		for (var key in data) {
			//str_temp = str_temp + 'type: [' + typeof data[key] + '], key: [' + key + '], value: [' + data[key] + ']'+'\n';
			str_temp = str_temp + '[' + typeof data[key] + '] ' + key + ' : ' + data[key] + '\n';
		}

	return str_temp;
}


function insert_dc(editor) {
    var cm = editor;
    var doc = cm.getDoc();
    var cursor = doc.getCursor();
    var line = doc.getLine(cursor.line);
    var pos = { line: cursor.line, ch: 0  };
    doc.replaceRange('          "', pos);
	pos.ch = line.length+11;
    doc.replaceRange('"', pos);

	pos = { line: cursor.line+1, ch: 0  };
    doc.setCursor(pos);
}

function insert_gu(editor) {
    var cm = editor;
    var doc = cm.getDoc();
    var cursor = doc.getCursor();
    var line = doc.getLine(cursor.line);
    var pos = { line: cursor.line, ch: 0  };
    doc.replaceRange('//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////\n', pos);
}


function showForm(winId, node)
{
    $$(winId).getBody().clear();
    $$(winId).show(node);
    $$(winId).getBody().focus();
}

function hideForm(winId, node)
{
    $$(winId).getBody().clear();
    $$(winId).hide(node);
}


function open_temp_popup(p_str, callback)
{
    webix.ui
    ({  view:"popup",        id:"temp_pop",        height:100,        width:300,
        position:"center",        head:false,        body:{ template:'<b>'+p_str+'</b>' }
    }).show();

    if (typeof callback == 'function')
        callback();
}

function close_temp_popup()
{
    $$('temp_pop').close();
}


function set_grid(text, grid)
{
    var jsd = JSON.parse(text);

    grid.clearAll();
    grid.config.columns = [];
    grid.refreshColumns();

    grid.parse(jsd["data"]);

    var i = 0;
    for (var key in jsd["data"][0])
    {
        // if ((key != '일자') && (key != '단축코드') && (key != '종목코드') && (key != 'id') &&  (key != '종목번호') &&
        // (key[key.length-1] != '_') && (key != '테마') && (key != '업종') && (key != '기준') &&  (key != '코드') &&
        // (!(isNaN(parseInt(jsd["data"][0][key])))))
        // {
        //     grid.config.columns[i].sort = 'int';
        //     grid.config.columns[i].format = webix.i18n.intFormat;
        //     //grid.config.columns[i].cssFormat  = {'text-align':'right'};
        //     //grid.config.columns[i].cssFormat = {"background-color":"#FFAAAA"};
        // }

        grid.adjustColumn(key, 'all');
        i = i + 1;
    }

    grid.refresh();
}

function set_grid_python_select(text, grid)
{
    var jsd = JSON.parse(text);

    grid.clearAll();

    if (jsd['check_result'] == 'good')
    {
        var col_title = [];
        for (var key in jsd['cols'])
            col_title.push({'id':key, 'col_name':jsd['cols'][key], 'header':jsd['cols'][key], adjust:true});

        grid.config.columns = col_title;
        grid.refreshColumns();

        grid.parse(jsd['rows']);

        for (var key in jsd['cols'])
            grid.adjustColumn(key, 'all');
    }
    else
        alert(jsd['error_message']);
}

function format_date(str_date)
{
    if ((str_date===null) || (str_date===''))
        return ''
    else
        return str_date.substring(2,4)+'.'+str_date.substring(4,6)+'.'+str_date.substring(6,8)
}

function get_pm_mon(p_day, p_pm)
{
	var dat1 = new Date(p_day.substring(0,4), p_day.substring(4,6), p_day.substring(6,8));
	dat1.setMonth(dat1.getMonth() + p_pm);

    var year = dat1.getFullYear();
    var month = dat1.getMonth();
    var day = dat1.getDate();

    if ((day+"").length < 2) { day = "0" + day; }
    if ((month+"").length < 2) { month = "0" + month; }

    return year +''+ month +''+ day;
}


function get_today()
{
    var date = new Date();

    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();

    if ((day+"").length < 2) {
        day = "0" + day;
    }

    if ((month+"").length < 2) {
        month = "0" + month;
    }

    return year +''+ month +''+ day;
}

function comma1000(num)
{
	num = String(num);
    return num.replace(/(\d)(?=(?:\d{3})+(?!\d))/g,"$1,");
}

function get_that_day(p_date, p_cha)
{
    let date = new Date(parseInt(p_date.substring(0,4)),
                        parseInt(p_date.substring(4,6))-1,
                        parseInt(p_date.substring(6,8)) );

    date.setDate(date.getDate() + p_cha);

    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();

    if ((day+"").length < 2) {
        day = "0" + day;
    }

    if ((month+"").length < 2) {
        month = "0" + month;
    }

    return year +''+ month +''+ day;
}
