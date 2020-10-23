'use strict';

const Homey = require('homey');
const { ZigBeeDevice } = require('homey-zigbeedriver');
const { debug, CLUSTER } = require('zigbee-clusters');

class TemperatureAndHumiditySensor extends ZigBeeDevice {

	async onNodeInit({ zclNode }) {

		this.enableDebug();
		debug(true);
    this.printNode();

		// measure_temperature
		zclNode.endpoints[1].clusters[CLUSTER.TEMPERATURE_MEASUREMENT.NAME]
		.on('attr.measuredValue', this.onTemperatureMeasuredAttributeReport.bind(this));
  
		// measure_humidity
		zclNode.endpoints[1].clusters[CLUSTER.RELATIVE_HUMIDITY_MEASUREMENT.NAME]
    .on('attr.measuredValue', this.onRelativeHumidityMeasuredAttributeReport.bind(this));

/*     const node = await this.homey.zigbee.getNode(this);
		node.handleFrame = (endpointId, clusterId, frame, meta) => {
      this.log("frame data! endpointId:", endpointId,", clusterId:", clusterId,", frame:", frame, ", meta:", meta);
    }; */
    
    // measure_temperature & measure_humidity
/*       if (this.isFirstInit()){
        await this.configureAttributeReporting([
          {
            endpointId: 1,
            cluster: CLUSTER.TEMPERATURE_MEASUREMENT,
            attributeName: 'measuredValue',
            minInterval: 30,
            maxInterval: 60,
            minChange: 1,
          },
          {
            endpointId: 1,
            cluster: CLUSTER.RELATIVE_HUMIDITY_MEASUREMENT,
            attributeName: 'measuredValue',
            minInterval: 30,
            maxInterval: 60,
            minChange: 1,
            }
        ]);
      }

      zclNode.endpoints[1].clusters[CLUSTER.TEMPERATURE_MEASUREMENT.NAME]
      .on('attr.measuredValue', (currentTempValue) => {
        const temperatureOffset = this.getSetting('temperature_offset') || 0;
        const parsedValue = this.getSetting('temperature_decimals') === '2' ? Math.round((currentTempValue / 100) * 100) / 100 : Math.round((currentTempValue / 100) * 10) / 10;
        this.log('measure_temperature | temperatureMeasurement - currentTempValue (temperature):', parsedValue, '+ temperature offset', temperatureOffset);
        this.setCapabilityValue('measure_temperature', parsedValue + temperatureOffset);
      });

      zclNode.endpoints[1].clusters[CLUSTER.RELATIVE_HUMIDITY_MEASUREMENT.NAME]
      .on('attr.measuredValue', (currentHumValue) => {
        const humidityOffset = this.getSetting('humidity_offset') || 0;
        const parsedValue = this.getSetting('humidity_decimals') === '2' ? Math.round((currentHumValue / 100) * 100) / 100 : Math.round((currentHumValue / 100) * 10) / 10;
        this.log('measure_humidity | relativeHumidity - currentHumValue (humidity):', parsedValue, '+ humidity offset', humidityOffset);
        this.setCapabilityValue('measure_humidity', parsedValue + humidityOffset);
      }); */

		// measure_battery // alarm_battery
		zclNode.endpoints[1].clusters[CLUSTER.POWER_CONFIGURATION.NAME]
		.on('attr.batteryPercentageRemaining', this.onBatteryPercentageRemainingAttributeReport.bind(this));

	}

	onTemperatureMeasuredAttributeReport(measuredValue) {
		const temperatureOffset = this.getSetting('temperature_offset') || 0;
		const parsedValue = this.getSetting('temperature_decimals') === '2' ? Math.round((measuredValue / 100) * 100) / 100 : Math.round((measuredValue / 100) * 10) / 10;
		this.log('measure_temperature | temperatureMeasurement - measuredValue (temperature):', parsedValue, '+ temperature offset', temperatureOffset);
		this.setCapabilityValue('measure_temperature', parsedValue + temperatureOffset);
	}

	onRelativeHumidityMeasuredAttributeReport(measuredValue) {
		const humidityOffset = this.getSetting('humidity_offset') || 0;
		const parsedValue = this.getSetting('humidity_decimals') === '2' ? Math.round((measuredValue / 100) * 100) / 100 : Math.round((measuredValue / 100) * 10) / 10;
		this.log('measure_humidity | relativeHumidity - measuredValue (humidity):', parsedValue, '+ humidity offset', humidityOffset);
		this.setCapabilityValue('measure_humidity', parsedValue + humidityOffset);
	}

	onBatteryPercentageRemainingAttributeReport(batteryPercentageRemaining) {
		const batteryThreshold = this.getSetting('batteryThreshold') || 20;
		this.log("measure_battery | powerConfiguration - batteryPercentageRemaining (%): ", batteryPercentageRemaining/2);
		this.setCapabilityValue('measure_battery', batteryPercentageRemaining/2);
		this.setCapabilityValue('alarm_battery', (batteryPercentageRemaining/2 < batteryThreshold) ? true : false)
	}

	onDeleted(){
	this.log("temphumidsensor removed")
	}

}

module.exports = TemperatureAndHumiditySensor;
  
/*   "ids": {
    "modelId": "TH01",
    "manufacturerName": "eWeLink"
  },
  "endpoints": {
    "endpointDescriptors": [
      {
        "endpointId": 1,
        "applicationProfileId": 260,
        "applicationDeviceId": 770,
        "applicationDeviceVersion": 0,
        "_reserved1": 0,
        "inputClusters": [
          0,
          3,
          1026,
          1029,
          1
        ],
        "outputClusters": [
          3
        ]
      }
    ],
    "endpoints": {
      "1": {
        "clusters": {
          "basic": {
            "attributes": "UNSUP_GENERAL_COMMAND",
            "commandsGenerated": "UNSUP_GENERAL_COMMAND",
            "commandsReceived": "UNSUP_GENERAL_COMMAND"
          },
          "identify": {},
          "temperatureMeasurement": {},
          "relativeHumidity": {},
          "powerConfiguration": {}
        },
        "bindings": {
          "identify": {}
        }
      }
    }
  } */


  
/*   "ids": {
    "modelId": "TH01",
    "manufacturerName": "eWeLink"
  },
  "endpoints": {
    "endpointDescriptors": [
      {
        "endpointId": 1,
        "applicationProfileId": 260,
        "applicationDeviceId": 770,
        "applicationDeviceVersion": 0,
        "_reserved1": 0,
        "inputClusters": [
          0,
          3,
          1026,
          1029,
          1
        ],
        "outputClusters": [
          3
        ]
      }
    ],
    "endpoints": {
      "1": {
        "clusters": {
          "basic": {},
          "identify": {},
          "temperatureMeasurement": {
            "commandsGenerated": "UNSUP_GENERAL_COMMAND",
            "commandsReceived": "UNSUP_GENERAL_COMMAND"
          },
          "relativeHumidity": {
            "attributes": "UNSUP_GENERAL_COMMAND",
            "commandsGenerated": "UNSUP_GENERAL_COMMAND",
            "commandsReceived": "UNSUP_GENERAL_COMMAND"
          },
          "powerConfiguration": {
            "attributes": "UNSUP_GENERAL_COMMAND",
            "commandsGenerated": "UNSUP_GENERAL_COMMAND",
            "commandsReceived": "UNSUP_GENERAL_COMMAND"
          }
        },
        "bindings": {
          "identify": {}
        }
      }
    }
  } */