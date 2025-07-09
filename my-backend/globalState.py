import time

globalProductsList = {}
globalCategories = []

last_fetch_time = 0  # Timestamp poslednjeg fetch-a
FETCH_COOLDOWN_SECONDS = 10800  # 3 sata ( 3 * 60 * 60)