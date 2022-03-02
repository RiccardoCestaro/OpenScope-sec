import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains

s = Service('./chromedriver_linux64/chromedriver')
driver = webdriver.Chrome(service=s)
driver.get('http://localhost:3003')

time.sleep(2)

settings = driver.find_element(By.XPATH, "//div[4]/ul/li[5]")
ActionChains(driver).move_to_element(settings).perform()

time.sleep(2)

attacks = driver.find_element(By.XPATH, "//div[4]/ul/li[5]/div[1]/a[1]")
attacks.click()

perc = Select(driver.find_element(By.XPATH, "//div[12]/div[1]/div[1]/span[2]/select[1]"))
perc.select_by_value("Normal")

non_resp = Select(driver.find_element(By.XPATH, "//div[12]/div[1]/div[2]/span[2]/select[1]"))
non_resp.select_by_value("1")

jump = Select(driver.find_element(By.XPATH, "//div[12]/div[1]/div[3]/span[2]/select[1]"))
jump.select_by_value("1")

false_data = Select(driver.find_element(By.XPATH, "//div[12]/div[1]/div[4]/span[2]/select[1]"))
false_data.select_by_value("1")

stand_still = Select(driver.find_element(By.XPATH, "//div[12]/div[1]/div[5]/span[2]/select[1]"))
stand_still.select_by_value("1")

trajectory = Select(driver.find_element(By.XPATH, "//div[12]/div[1]/div[6]/span[2]/select[1]"))
trajectory.select_by_value("1")

false_alarm = Select(driver.find_element(By.XPATH, "//div[12]/div[1]/div[7]/span[2]/select[1]"))
false_alarm.select_by_value("1")

spoof = Select(driver.find_element(By.XPATH, "//div[12]/div[1]/div[8]/span[2]/select[1]"))
spoof.select_by_value("1")

ghost = Select(driver.find_element(By.XPATH, "//div[12]/div[1]/div[9]/span[2]/select[1]"))
ghost.select_by_value("10")

jump_prob = Select(driver.find_element(By.XPATH, "//div[12]/div[1]/div[11]/span[2]/select[1]"))
jump_prob.select_by_value("250")


question_mark = driver.find_element(By.XPATH, "//div[4]/ul/li[6]")
ActionChains(driver).move_to_element(question_mark).perform()

time.sleep(2)

download_button = driver.find_element(By.ID, "dwn-adsb")
driver.implicitly_wait(10)
ActionChains(driver).move_to_element(download_button).click(download_button).perform()


