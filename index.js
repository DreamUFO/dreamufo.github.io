function initMap(center) {
	var osm = new ol.layer.Tile({
		source: new ol.source.OSM()
	});

	center=ol.proj.fromLonLat(center);

	var mousePositionControl = new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(4),
        projection: 'EPSG:4326',
        // comment the following two lines to have the mouse position
        // be placed within the map.
        className: 'custom-mouse-position',
        target: document.getElementById('mouse-position'),
        undefinedHTML: '&nbsp;'
      });

	var map = new ol.Map({
		layers: [osm],
		target: 'map',
		controls: ol.control.defaults({
			attribution: false
		}).extend([mousePositionControl]),
		view: new ol.View({
			center: center,
			zoom: 12
		})
	});
	GlobalObject["map"] = map;
}

function initPage() {
	httpGet("http://www.geoplugin.net/json.gp", function(responese) {
		var center = [0, 0];
		try {
			var ipData = JSON.parse(responese);
			center = [parseFloat(ipData["geoplugin_longitude"]) ,parseFloat(ipData["geoplugin_latitude"])];
			var geoInfo=ipData["geoplugin_city"]+","
			+ipData["geoplugin_regionName"]+","
			+ipData["geoplugin_countryName"]+","
			+ipData["geoplugin_continentName"]+"<br/>"
			+"IP:"+ipData["geoplugin_request"];

			document.getElementById('geoInfo').innerHTML=geoInfo;
		} catch (err) {
			console.error(err);
		}
		initMap(center);
	});

}

function httpGet(url, callback) {
	//步骤一:创建异步对象
	var ajax = new XMLHttpRequest();
	//步骤二:设置请求的url参数,参数一是请求的类型,参数二是请求的url,可以带参数,动态的传递参数starName到服务端
	ajax.open('get', url);
	//步骤三:发送请求
	ajax.send();
	//步骤四:注册事件 onreadystatechange 状态改变就会调用
	ajax.onreadystatechange = function() {
		if (ajax.readyState == 4 && ajax.status == 200) {
			//步骤五 如果能够进到这个判断 说明 数据 完美的回来了,并且请求的页面是存在的
			if (callback) {
				callback(ajax.responseText);
			}
		}
	}
}

var GlobalObject = {};
window.onload = initPage;
