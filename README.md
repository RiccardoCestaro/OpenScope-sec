# openScope Air Traffic Control Simulator with ADS-B attacks

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
  
  
  
  
-------------------------------Below text is from standard openscope repository---------------------------

  
  
  
  
Visit http://openscope.io to begin playing now!

If you're just getting started, try the tutorial and see the [command reference](documentation/commands.md) for a full list of commands you can use. For information on each airport, see the [airport guide](documentation/airport-guides/airport-guide-directory.md).

Feel free to [join us on slack](http://slack.openscope.io/) if you have questions, comments or would like to contribute to the project. We can then add you to the organization so you can begin committing to this repo.

---

## Developer Quick Start

_Prerequisites: In order to successfully complete this quick start, you will need to have the following installed locally:_

- [Git](https://git-scm.com/downloads)
- [Node](https://nodejs.org/en/download/)

_Installation directions are beyond the scope of this document.  Instead, search the [Google](http://google.com).  Installing these two packages has been written about ad-nauseum._

From a terminal (or GitBash for Windows users), run the following commands:

1. `git clone https://github.com/openscope/openscope.git`
1. `cd openscope`
1. `npm install`
1. `npm run build`
1. `npm run start`

Once that finishes doing its thing, you should see something close to the following in the terminal:

```bash
> node ./public/assets/scripts/server/index.js

Listening on PORT 3003
```

Success!!

You you do not see this message and are having trouble getting set up, please join us on [Slack](http://slack.openscope.io) and someone will be able to troubleshoot with you.

For more information on the available tools, please view the [Tools Readme](tools/README.md).

## Contributing

We do not use forks. Instead, we add to add all contributors to the openScope organization. This way, we can keep all branches local to the organization, and use testing integrations on pull requests. If you are interested in contributing, _please message Erik Quinn or Nate Geslin on slack_ so you can be added to the organization.

We use the [GitFlow Branching Model](http://nvie.com/posts/a-successful-git-branching-model) for managing branches.  If you would like to contribute, you will be expected to use appropriate branch names based on this methodology (and we can help if you have questions).

Don't know Javascript?  That's cool, we're always looking for beta testers and/or airport contributors.  If you would like to add a new airport, or help update existing airports, please read the [Airport Format Documentation](documentation/airport-format.md) and [Airport File Standards Documentation](documentation/airport-file-standards.md) to get up to speed on what is expected in that file.

## Privacy Disclosures

We use Google Analytics for gathering data about how our app is used. See [Event Tracking](documentation/event-tracking.md) for more information.

## Credits

OpenScope is supported by the following awesome projects. Thank you!

- [![pullreminders](https://pullreminders.com/badge.svg)](https://pullreminders.com?ref=badge) - Slack integration to improve our PR response time

## License

[MIT License](LICENSE.md) 
