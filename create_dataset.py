import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains



s = Service('./chromedriver_linux64/chromedriver')
driver = webdriver.Chrome(service=s)
driver.get('http://localhost:3003')

time.sleep(3)

settings = driver.find_element(By.XPATH, "//div[4]/ul/li[5]")
ActionChains(driver).move_to_element(settings).perform()

time.sleep(2)

attacks = driver.find_element(By.XPATH, "//div[4]/ul/li[5]/div[1]/a[1]")
attacks.click()

perc = Select(driver.find_element(By.ID, "attack-rarity"))
perc.select_by_value("Normal")

non_resp = Select(driver.find_element(By.ID, "stop-rarity"))
non_resp.select_by_value("1")

time.sleep(2)

jump = Select(driver.find_element(By.ID, "jump-freq"))
jump.select_by_value("1")

time.sleep(2)

false_data = Select(driver.find_element(By.ID, "error-rarity"))
false_data.select_by_value("1")

time.sleep(2)

stand_still = Select(driver.find_element(By.ID, "stand-rarity"))
stand_still.select_by_value("1")

time.sleep(2)

trajectory = Select(driver.find_element(By.ID, "vtm"))
trajectory.select_by_value("1")

time.sleep(2)

false_alarm = Select(driver.find_element(By.ID, "false-alarm"))
false_alarm.select_by_value("1")

time.sleep(2)

spoof = Select(driver.find_element(By.ID, "spoof"))
spoof.select_by_value("1")

time.sleep(2)

ghost = Select(driver.find_element(By.ID, "ghost"))
ghost.select_by_value("10")

time.sleep(2)

jump_prob = Select(driver.find_element(By.ID, "jump-prob"))
jump_prob.select_by_value("50")

time.sleep(2)

delay = Select(driver.find_element(By.ID, "mess-delay-rarity"))
delay.select_by_value("1")

time.sleep(2)

delay_rate = Select(driver.find_element(By.ID, "mess-delay"))
delay_rate.select_by_value("10")

time.sleep(60)


question_mark = driver.find_element(By.XPATH, "//div[4]/ul/li[6]")
ActionChains(driver).move_to_element(question_mark).perform()

download_button = driver.find_element(By.ID, "dwn-adsb")
driver.implicitly_wait(10)
ActionChains(driver).move_to_element(download_button).click(download_button).perform()


