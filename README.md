# OpenScope-sec: openScope Air Traffic Control Simulator with ADS-B attacks

To get started playing the simulator with ADS-B attacks, please follow the instructions called "Developer Quick Start" to start the simulator locally on your computer. The first extension was built by Anton Blåberg & Gustav Lindahl as a bachelor thesis work at Linköping University in 2020 and can be found on this repository: https://github.com/joakimthorn96/openScopeAttacks.
The second extension provides new types of attacks and was implemented by Eleonora Mancini & Riccardo Cestaro for a university project in Padua. First and second extensions are available in this repository.


## Attacks

Below are described all the attacks implemented in the first and second extension.

For the first extension:

1. Non-responsive aircraft: this attack affects the communication between aircraft and ATCs, therefore the aircraft are no longer able to respond to commands issued by the ATCs.
2. Jumping aircraft: simulates a message modification attack in which the adversary modifies the longitudinal and latitudinal coordinates. In this way, the aircraft will ”jump” to another location. After the jump, the aircraft will continue to send modified messages with a different position, until it reaches its destination (which is still the original one).
3. Aircraft displaying false information: another message modification attack in which the adversary spoofs the velocity and altitude. Differently from the previous one, in this attack the fake messages are not continuous, the aircraft can also send authentic messages in between the fake ones.
4. Aircraft standing still: in this attack the longitudinal and latitudinal coordinates will no longer change and the velocity will be set to 0, making the aircraft standing still.

For the second extension:

1. Virtual Trajectory Modification: is an attack that in a real case scenario would be performed using the message modification technique; in this simulation instead we altered the trajectory of the aircraft by changing its heading field. The amount of changes on this value is random, but within a certain predetermined limit. 
The aircraft affected by this attack changes its heading many times through time, at random intervals.
2. False Alarm Attack: to simulate the False Alarm Attack (or Virtual Aircraft Hijacking) the aircraft's transponder code field was altered. When an aircraft is affected by this attack, the transponder code is replaced with an emergency code, chosen at random. The original squawk code is saved in order to be restored when the attack is over.
3. Aircraft Spoofing: in the original Aircraft Spoofing attack the adversary modifies the aircraft's ICAO 24-bit address to carry out the attack. However, the OpenScope simulator does not assign this address to the planes, therefore, to simulate the aircraft spoofing, we used its unique id, which is present on the simulator. We changed this field in order to make it correspond to the id of another aircraft, while the original one is saved in order to be restored when the attack is over.
4. Ghost Injection Attack: in the real world, the Ghost Injection Attack is performed by injecting fabricated ADS-B messages on the same frequency as the legitimate ones, making non-existing aircraft appear on the radar: to simulate this, we generated a set of ghost aircraft, i.e. fake planes created with random altitude, callsign, heading, speed and transponder code, and added them to the simulator. The number of random temporary aircraft can be chosen by the user. Consequently the user can delete them using the apposite option on the GUI. 
5. Message Delay Attack: the aircraft affected by this attack send ADS-B messages with a lower frequency than normal. In a real case scenario this could be obtained by the adversary by deleting some of the ADS-B messages that the aircraft broadcasts. In the simulation though, this is obtained by saving tuples only when the number of updates modulo n is zero, where n is the delay rate that can be chosen in the GUI. This value ranges from skipping only one message up to skipping 70 of them.

Also, for the second extension we implement the possibility to choose a specific aircraft to attack since before aircraft are chosen according to a distribution.

## Developer Quick Start

The guide is pretty similar to the original OpenScope.

_Prerequisites: In order to successfully complete this quick start, you will need to have the following installed locally:_

- Git: sudo apt install git
- Nodejs: sudo apt-get install -y nodejs

To install and run OpenScope-sec run the following commands:

1. `git clone https://github.com/RiccardoCestaro/OpenScope-plus.git`
2. `cd openscope`
3. `npm install`
4. `npm run build`
5. `npm run start`

Once that finishes doing its thing, you should see something close to the following in the terminal:

```bash
> node ./public/assets/scripts/server/index.js

Listening on PORT 3003
```

You should now be able to play with the simulator by opening a browser (Google Chrome is recommended) and connecting at the following address:
`localhost:3003`

However, since Google Chrome updates very often there may be the necessity to update the Chrome driver.
To do so, you can download it at the following link: https://chromedriver.chromium.org/downloads, and place/overwrite it in the `chromedriver_linux64`.
Note that the Chrome drivers must match your Google Chrome version.

### Team
Eleonora Mancini (eleonora.mancini@studenti.unipd.it)  
Riccardo Cestaro (riccardo.cestaro.1@studenti.unipd.it)  
Federico Turrin (turrin@math.unipd.it)

We are members of [SPRITZ Security and Privacy Research Group](https://spritz.math.unipd.it/) at University of Padua, Italy.

### Cite

Are you using OpenScope-sec in your research work? Please, cite us:
```bibtex   
The paper is still under submission
```


OpenScope is supported by the following awesome projects. Thank you!

- [![pullreminders](https://pullreminders.com/badge.svg)](https://pullreminders.com?ref=badge) - Slack integration to improve our PR response time

## License

[MIT License](LICENSE.md) 
