package util

import (
	"github.com/spf13/viper"
)

type Config struct {
	DB_NAME     string `mapstructure:"DB_NAME"`
	DB_USERNAME string `mapstructure:"DB_USERNAME"`
	DB_PASSWORD string `mapstructure:"DB_PASSWORD"`
	DB_DATABASE string `mapstructure:"DB_DATABASE"`
	DB_URL      string `mapstructure:"DB_URL"`
	PORT        string `mapstructure:"PORT"`
	GRPC_URL    string `mapstructure:"GRPC_URL"`
}

func LoadConfig(path string) (Config, error) {
	var config Config
	viper.SetConfigName("env")  // name of config file (without extension)
	viper.SetConfigType("yaml") // REQUIRED if the config file does not have the extension in the name
	viper.AddConfigPath(path)   // path to look for the config file in
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		return config, err
	}

	if err := viper.Unmarshal(&config); err != nil {
		return config, err
	}

	return config, nil
}
