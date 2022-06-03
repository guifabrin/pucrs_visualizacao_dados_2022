import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots

data = pd.read_csv("athlete_events.csv")
filename = "docs/average_physical_characteristics_by_year_line_bars.html"
fig = make_subplots(specs=[[{"secondary_y": True}]])

years = data['Year'].unique()
years.sort()

sex = data['Sex'].unique()
years_sex_count = []
for index_year in range(0, len(years)):
    year = years[index_year]
    values = {}
    for sex_v in sex:
        values[sex_v] = data[data['Year'] == year][data['Sex'] == sex_v]['Sex'].count()
    values['All'] = data[data['Year'] == year]['Sex'].count()
    years_sex_count.append(values)

fig.add_trace(
    go.Scatter(x=years, y=list(map(lambda value: value['All'], years_sex_count)), name="Sex: All count"),
    secondary_y=False,
)
for sex_v in sex:
    fig.add_trace(
        go.Scatter(x=years, y=list(map(lambda value: value[sex_v], years_sex_count)), name="Sex: " + sex_v + " count"),
        secondary_y=False,
    )

ages = data['Age'].unique()
years_age_avg = []
for index_year in range(0, len(years)):
    year = years[index_year]
    values = {}
    ages = list(filter(lambda item: item > 0, list(data[data['Year'] == year]['Age'])))
    if len(ages) > 0:
        values['All'] = sum(ages) / len(ages)
    else:
        values['All'] = 0
    for sex_v in sex:
        ages_sex = list(filter(lambda item: item > 0, list(data[data['Year'] == year][data['Sex'] == sex_v]['Age'])))
        values['year'] = year
        if len(ages_sex) > 0:
            values[sex_v] = sum(ages_sex) / len(ages_sex)
        else:
            values[sex_v] = 0
    years_age_avg.append(values)

data_ages = pd.DataFrame(years_age_avg)

for sex_v in sex:
    data_sex = data[data['Sex'] == sex_v]
    fig.add_trace(
        go.Histogram(x=data_sex['Year'], y=data_sex['Age'], histfunc='avg', name='Age: '+sex_v+' avg'),
        secondary_y=True,
    )
for sex_v in sex:
    data_sex = data[data['Sex'] == sex_v]
    fig.add_trace(
        go.Histogram(x=data_sex['Year'], y=data_sex['Height'], histfunc='avg', name='Height: '+sex_v+' avg'),
        secondary_y=True,
    )
for sex_v in sex:
    data_sex = data[data['Sex'] == sex_v]
    fig.add_trace(
        go.Histogram(x=data_sex['Year'], y=data_sex['Weight'], histfunc='avg', name='Weight: '+sex_v+' avg'),
        secondary_y=True,
    )

fig.update_layout(barmode="overlay")

fig.update_layout(
    title_text="Average of physical characteristics by year"
)
fig.update_xaxes(title_text="Years")
fig.update_yaxes(title_text="Count", secondary_y=False)
fig.update_yaxes(title_text="Avg", secondary_y=True)
fig.write_html(filename)
