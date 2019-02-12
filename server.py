import bottle
import get_countries


@bottle.route("/")
def host_html():
    return bottle.static_file("index.html", root="/projects/Project-Part-2")


@bottle.route("/bubblemap.js")
def host_js():
    return bottle.static_file("bubblemap.js", root="/projects/Project-Part-2")


@bottle.route('/get_countries')
def get_data():
    url = "https://opendata.socrata.com/resource/hj43-2bpj.json "
    url2 = "https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/slim-3/slim-3.json "
    return get_countries.get_cc(url, url2)


bottle.run(host="0.0.0.0", port=8080, debug=True)
