# initial data script to populate dynamo using the lambda api
import pandas as pd
df = pd.read_csv(r'./uwsalaries.csv')
df.to_json(r'./uwsalaries.json', orient="records")
