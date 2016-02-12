# HPcomfort
Ionic app to control the comfort state of an [ochsner] heat pump

Dieses Programm nutzt die SOAP Schnittstelle des web2com Interfaces um die Behaglichkeit einzustellen

# Liste der ID's

Die ID wird aus fünf Zahlen gebildet die mit "/" getrennt sind.

/a/b/c/d/e

Abhängig von der Anlagenkonfiguration können die Nummern von dieser Liste abweichen.

a = 1 -> eBus

b = 2 -> Anlage

c = 1 -> Wärmepumpe
	d = 125 -> Betriebsdaten
		e = 00 -> Status Wärmeerzeuger [1:Heizbetrieb;?]
		e = 01 -> IST Temp.TWV [°C]
		e = 02 -> Vorlauftemp. Sollwert Anforderung Wärmeerzeuger [°C]
		e = 03 -> IST Temp.TWR [°C]
		e = 04 -> IST Temp.TQA [°C]
		e = 05 -> IST Temp.TQE [°C]
		e = 06 -> Schaltzyklen
		e = 07 -> Betriebsstunden [h]
		e = 08 -> Volumenstrom Wärmenutzung [l/m]
		e = 09 -> Volumenstrom Wärmequelle [l/m]
		e = 10 -> Heizenergie [kWh]
		e = 11 -> Heizenergie [MWh]
		e = 12 -> Warmwasserenergie [kWh]
		e = 13 -> Warmwasserenergie [MWh]

c = 4 -> Heizkreis
	d = 119 -> Betriebsdaten
		e = 00 -> Status Heizkreis [1:Normal Heizbetrieb;?]
		e = 01 -> Aussentemperatur [°C]
		e = 02 -> Mittelwert Aussentemperatur [°C]
		e = 03 -> Sollwert Raumtemperatur [°C]
		e = 04 -> Heizkreis Vorlauftemperatur [°C]
		e = 05 -> Sollwert HeizkreisVorlauftemperatur [°C]

c = 7 -> Warmwasserkreis
	d = 121 -> Betriebsdaten
		e = 00 -> Status Warmwasser [0:Abgeschaltet;?]
		e = 01 -> IST Temp.TBWarmwasser [°C]
		e = 02 -> Sollwert Warmwassertemperatur [°C]

c = 8 -> Wärmeverteiler
	d = 122 -> Betriebsdaten
		e = 01 -> IST Temp. TPMPuffertemperatur Mitte [°C]
		e = 02 -> Anlage Vorlauftemperatur [°C]
		e = 03 -> Sollwert Anlagevorlauf [°C]
		e = 04 -> Heizleistung Heizbetrieb [kW]
		e = 05 -> Heizleistung Warmwasserbetrieb [kW]
		e = 06 -> Status Wärmemanager [1:Heizen;?]




## Usage

Install the [ionic] framework and copy the files to the "www" directory

or

Install the [android] version.





[ionic]: http://ionicframework.com
[pouchdb]: http://pouchdb.com
[ochsner]: http://www.ochsner.com
[android]: https://play.google.com/store/apps/details?id=com.hackl.HPcomfort

