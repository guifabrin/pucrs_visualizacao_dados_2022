import os.path

import pandas as pd

df = pd.read_csv("athlete_events.csv")
noc_file_df = pd.read_csv("noc_regions.csv")


def process_sex(sex, season, year):
    temp = df[df['Sex'] == sex][df['Season'] == season][df['Year'] == year]
    if len(temp['Name'].unique()) == 0:
        return None
    avgAge = 0
    avgHeight = 0
    avgWeight = 0
    try:
        avgAge = temp['Age'].sum() / len(temp['Age'])
    except:
        pass
    try:
        avgHeight = temp['Height'].sum() / len(temp['Height'])
    except:
        pass
    try:
        avgWeight = temp['Age'].sum() / len(temp['Age'])
    except:
        pass
    return {
        'Sex': sex,
        'Participants': len(temp['Name'].unique()),
        'AvgAge': avgAge,
        'AvgHeight': avgHeight,
        'AvgWeight': avgWeight,
        'GoldMedals': temp[df['Medal'] == 'Gold']['Medal'].count(),
        'SilverMedals': temp[df['Medal'] == 'Silver']['Medal'].count(),
        'BronzeMedals': temp[df['Medal'] == 'Bronze']['Medal'].count(),
    }


data_filename = 'docs/custom_participants_by_country.json'

if not os.path.exists(data_filename):
    results = {}
    for year in df['Year'].unique():
        results[str(year)] = {}
        for season in df['Season'].unique():
            result = list(
                filter(lambda item: item, map(lambda item: process_sex(item, season, year), list(df['Sex'].unique()))))
            if len(result) == 0:
                continue
            results[str(year)][season] = result
    with open(data_filename, "w") as file:
        file.write(str(results).replace('\'', "\""))
