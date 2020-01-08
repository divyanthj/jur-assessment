module.exports = {
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 7545,
      gas: 6721975,
      network_id: "*" // Match any network id
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
