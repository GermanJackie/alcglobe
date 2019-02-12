import urllib.request
import json


def get_cc(url, url2):
    usa = {"liters": "8.89", "location": "USA", "code": "USA"}
    russia = {"liters": "15.76", "location": "Russia", "code": "RUS"}
    all = []
    str = "liters_per_capita_pure_alcohol_adult_consumption"
    response = urllib.request.urlopen(url)
    data = json.loads(response.read().decode(response.info().get_param('charset') or 'utf-8'))
    # data= [{"location" : "Afghanistan","liters..." : "0.01"}, {
    newResponse = urllib.request.urlopen(url2)
    newData = json.loads(newResponse.read().decode(newResponse.info().get_param('charset') or 'utf-8'))
    # newData= [{"name":"Afghanistan","alpha-3":"AFG","country-code":"004"},{
    for obj in data:
        if str in obj:
            obj["liters"] = obj.pop(str)
            # data= [{"liters":"0.01","location":"Afghanistan"},{
            for item in newData:
                if item["name"] == obj["location"]:
                    obj["code"] = item["alpha-3"]
        else: del(obj["location"])
    data.append(usa)
    data.append(russia)
    for s in data:
        if s:
            all.append(s)
    return json.dumps(all) # [{"liters":"0.01","location":"AFG", "country" : "Afghanistan"},


# url = "https://opendata.socrata.com/resource/hj43-2bpj.json "
# url2 = "https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/slim-3/slim-3.json "

# print(get_cc(url, url2))
