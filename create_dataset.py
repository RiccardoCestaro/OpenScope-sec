import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains

# load the service
s = Service('./chromedriver_linux64/chromedriver')
driver = webdriver.Chrome(service=s)
driver.get('http://localhost:3003')

# wait the tool set up
time.sleep(3)

# normal traffic collection
time.sleep(20)

##### Attack generation ########
# to find the parameters have a look at openscope-attacks-develop/public/assets/scripts/client/bundle.min.js


settings = driver.find_element(By.XPATH, "//div[4]/ul/li[5]")
ActionChains(driver).move_to_element(settings).perform()

# open attack tab
attacks = driver.find_element(By.XPATH, "//div[4]/ul/li[5]/div[1]/a[1]")
attacks.click()

# set aircraft attack frequency
perc = Select(driver.find_element(By.ID, "attack-rarity"))
perc.select_by_value("Normal")

## Non-responsive aircraft attack
non_resp_flooding = Select(driver.find_element(By.ID, "flooding"))
non_resp_flooding.select_by_value("0")  # equal to none
non_resp = Select(driver.find_element(By.ID, "stop-rarity"))
non_resp.select_by_value("1")
time.sleep(7)
non_resp.select_by_value("0")
# attack effect cooldown
time.sleep(10)

## Jumping aircraft attack
jump_probability = Select(driver.find_element(By.ID, "jump-prob"))
jump_probability.select_by_value("1250")  # equal to low
jump_dinstance = Select(driver.find_element(By.ID, "jump-rad"))
jump_dinstance.select_by_value("Moderate")  # equal to medium
jump = Select(driver.find_element(By.ID, "jump-freq"))
jump.select_by_value("1")
time.sleep(7)
jump.select_by_value("0")
# attack effect cooldown
time.sleep(10)

## Aircraft displaying false information attack
false_data = Select(driver.find_element(By.ID, "error-rarity"))
false_data.select_by_value("1")
time.sleep(7)
false_data.select_by_value("0")
# attack effect cooldown
time.sleep(10)

## Aircraft standing still attack
stand_still = Select(driver.find_element(By.ID, "stand-rarity"))
stand_still.select_by_value("1")
time.sleep(7)
stand_still.select_by_value("0")
# attack effect cooldown
time.sleep(10)

## Virtual Trajectory Modification attack
trajectory_slope = Select(driver.find_element(By.ID, "traj-slope"))
trajectory_slope.select_by_value("2 15")  # equivalent to low
trajectory_degree = Select(driver.find_element(By.ID, "traj-max-change"))
trajectory_degree.select_by_value("0.0174533")  # equal to 1 degree
trajectory = Select(driver.find_element(By.ID, "vtm"))
trajectory.select_by_value("1")
time.sleep(7)
trajectory.select_by_value("0")
# attack effect cooldown
time.sleep(10)

## False alarm attack
false_alarm = Select(driver.find_element(By.ID, "false-alarm"))
false_alarm.select_by_value("1")
time.sleep(7)
false_alarm.select_by_value("0")
# attack effect cooldown
time.sleep(10)

## aircraft spoofing attack
spoof = Select(driver.find_element(By.ID, "spoof"))
spoof.select_by_value("1")
time.sleep(7)
spoof.select_by_value("0")
# attack effect cooldown
time.sleep(10)

# Ghost Injection attack
ghost = Select(driver.find_element(By.ID, "ghost"))
ghost.select_by_value("10")  # number of ghost aircraft
time.sleep(7)
ghost.select_by_value("0")
# attack effect cooldown
time.sleep(10)

# message delay attack
delay_rate = Select(driver.find_element(By.ID, "mess-delay"))
delay_rate.select_by_value("10")  # equal to medium
delay = Select(driver.find_element(By.ID, "mess-delay-rarity"))
delay.select_by_value("1")
time.sleep(7)
delay.select_by_value("0")
# attack effect cooldown
time.sleep(10)

# normal traffic recollection
time.sleep(60)

#####Download dataset

question_mark = driver.find_element(By.XPATH, "//div[4]/ul/li[6]")
ActionChains(driver).move_to_element(question_mark).perform()

download_button = driver.find_element(By.ID, "dwn-adsb")
driver.implicitly_wait(10)
ActionChains(driver).move_to_element(download_button).click(download_button).perform()
time.sleep(10)
