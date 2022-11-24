import requests
import json
import clearbit

clearbit.key = 'sk_35846bd98a0983e90d50fe22603a9a01'


with open('uwsalaries.json', 'r') as f:
  data = json.load(f)

# r = requests.get(
#     'https://842gb0w279.execute-api.ca-central-1.amazonaws.com/items')
# print(r.content)

for i, item in enumerate(data):
  print(item)
  info = clearbit.Company.find(domain=item['company'])
  info['salary'] = item['salary']
  info['Currency'] = item['Currency']
  info['info'] = item['info']
  info['company'] = info['name']
  response = requests.put(
      'https://842gb0w279.execute-api.ca-central-1.amazonaws.com/items', data=json.dumps(info), headers={"Content-Type": "application/json"})
  print(response.content)
