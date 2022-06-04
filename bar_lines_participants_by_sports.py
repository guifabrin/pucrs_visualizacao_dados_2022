import os.path

import pandas as pd

df = pd.read_csv("athlete_events.csv")
noc_file_df = pd.read_csv("noc_regions.csv")


def process_sport(sport, season, year):
    temp = df[df['Sport'] == sport][df['Season'] == season][df['Year'] == year]
    if len(temp['Name'].unique()) == 0:
        return None
    return {
        'Sport': sport,
        'Participants': len(temp['Name'].unique()),
        'Participants_M': len(temp[df['Sex'] == 'M']['Name'].unique()),
        'Participants_F': len(temp[df['Sex'] == 'F']['Name'].unique()),
        'GoldMedals': temp[df['Medal'] == 'Gold']['Medal'].count(),
        'SilverMedals': temp[df['Medal'] == 'Silver']['Medal'].count(),
        'BronzeMedals': temp[df['Medal'] == 'Bronze']['Medal'].count(),
        'GoldMedals_M': temp[df['Sex'] == 'M'][df['Medal'] == 'Gold']['Medal'].count(),
        'SilverMedals_M': temp[df['Sex'] == 'M'][df['Medal'] == 'Silver']['Medal'].count(),
        'BronzeMedals_M': temp[df['Sex'] == 'M'][df['Medal'] == 'Bronze']['Medal'].count(),
        'GoldMedals_F': temp[df['Sex'] == 'F'][df['Medal'] == 'Gold']['Medal'].count(),
        'SilverMedals_F': temp[df['Sex'] == 'F'][df['Medal'] == 'Silver']['Medal'].count(),
        'BronzeMedals_F': temp[df['Sex'] == 'F'][df['Medal'] == 'Bronze']['Medal'].count(),
    }


data_filename = 'docs/bar_lines_participants_by_sports.json'

if not os.path.exists(data_filename):
    results = {}
    for year in df['Year'].unique():
        results[str(year)] = {}
        for season in df['Season'].unique():
            result = list(
                filter(lambda item: item, map(lambda item: process_sport(item, season, year), list(df['Sport'].unique()))))
            if len(result) == 0:
                continue
            results[str(year)][season] = result
    with open(data_filename, "w") as file:
        file.write(str(results).replace('\'', "\""))
