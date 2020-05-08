import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import {GoogleSignin} from '@react-native-community/google-signin';
import AsyncStorage from '@react-native-community/async-storage';
import {Picker} from '@react-native-community/picker';
import {UIActivityIndicator} from 'react-native-indicators';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

const MainScreen = ({route, navigation}) => {
  const {user} = route.params;

  const [transactions, setTransactions] = useState([]);

  const [balance, setBalance] = useState(0);

  const [category, setCategory] = useState('maistas');

  const [amount, setAmount] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={signOut}>
          <Text style={styles.signOut}>Atsijungti ({user.name})</Text>
        </TouchableOpacity>
      ),
      headerRightContainerStyle: {
        marginRight: 20,
      },
    });

    getTransactions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();

      await GoogleSignin.signOut();

      navigation.replace('Prisijungimas');
    } catch (error) {
      console.log(error);
    }
  };

  const getTransactions = async () => {
    try {
      let transactionsFromAS = await AsyncStorage.getItem(user.id);

      if (transactionsFromAS !== null) {
        transactionsFromAS = JSON.parse(transactionsFromAS);

        setTransactions(transactionsFromAS);

        updateBalance(transactionsFromAS);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const addTransaction = async () => {
    if (amount) {
      setLoading(true);

      try {
        const transaction = {category, amount: parseFloat(amount)};

        await AsyncStorage.setItem(
          user.id,
          JSON.stringify([transaction, ...transactions]),
        );

        setTransactions([transaction, ...transactions]);

        updateBalance([transaction, ...transactions]);

        setCategory('maistas');

        setAmount('');

        setLoading(false);
      } catch (error) {
        console.log(error);

        setLoading(false);
      }
    }
  };

  const deleteTransaction = async item => {
    setLoading(true);

    try {
      const updatedTransactions = transactions.filter(
        transaction => transaction !== item,
      );

      await AsyncStorage.setItem(user.id, JSON.stringify(updatedTransactions));

      setTransactions(updatedTransactions);

      updateBalance(updatedTransactions);

      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);
    }
  };

  const updateBalance = trans =>
    setBalance(
      trans.reduce((total, item) => {
        let totalBalance = total;

        if (item.category === 'įplaukos') {
          totalBalance += item.amount;
        } else {
          totalBalance -= item.amount;
        }

        return totalBalance;
      }, 0),
    );

  const ListItem = ({item}) => {
    return (
      <View style={styles.listItemView}>
        <Text
          style={[
            styles.listItemText,
            item.category === 'įplaukos' ? styles.green : styles.red,
          ]}>
          {item.category === 'įplaukos' ? '+' : '-'}
          {item.amount}
        </Text>

        <Text style={styles.listItemText}>{item.category}</Text>

        <TouchableOpacity onPress={() => deleteTransaction(item)}>
          <Icon name="trash-o" style={[styles.listItemText, styles.red]} />
        </TouchableOpacity>
      </View>
    );
  };

  const ActivityIndicator = () => {
    return (
      <View style={styles.activityIndicatorView}>
        <UIActivityIndicator />
      </View>
    );
  };

  return loading ? (
    <ActivityIndicator />
  ) : (
    <View style={styles.container}>
      <View style={styles.mainView}>
        <Text style={styles.balance}>
          Šio mėnesio balansas:{' '}
          <Text style={balance >= 0 ? styles.green : styles.red}>
            {balance > 0 && '+'}
            {balance}€
          </Text>
        </Text>

        <Picker
          selectedValue={category}
          style={styles.picker}
          onValueChange={itemValue => setCategory(itemValue)}>
          <Picker.Item label="Maistas" value="maistas" />
          <Picker.Item label="Pramogos" value="pramogos" />
          <Picker.Item label="Mokesčiai" value="mokesčiai" />
          <Picker.Item label="Apranga" value="apranga" />
          <Picker.Item label="Dovanos" value="dovanos" />
          <Picker.Item label="Įplaukos" value="įplaukos" />
          <Picker.Item label="Kita" value="kita" />
        </Picker>

        <TextInput
          style={styles.input}
          onChangeText={value => setAmount(value)}
          value={amount}
          placeholder="suma"
          keyboardType="numeric"
          onSubmitEditing={addTransaction}
        />
      </View>

      <View style={styles.listView}>
        <FlatList
          data={transactions}
          renderItem={({item, index}) => <ListItem item={item} index={index} />}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  signOut: {
    color: '#0275d8',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  activityIndicatorView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainView: {
    flex: 0.4,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  balance: {
    fontSize: 22,
  },
  picker: {width: '50%'},
  input: {
    width: '30%',
    borderColor: '#000',
    borderWidth: 1,
    fontSize: 20,
    paddingHorizontal: 7,
    borderRadius: 4,
  },
  listView: {
    flex: 0.6,
  },
  listItemView: {
    borderColor: '#000',
    borderWidth: 1,
    fontSize: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 20,
  },
  listItemText: {
    fontSize: 20,
  },
  red: {
    color: '#d9534f',
  },
  green: {
    color: '#5cb85c',
  },
});

export default MainScreen;
