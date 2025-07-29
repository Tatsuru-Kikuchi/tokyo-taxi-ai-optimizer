import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
  TextInput,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useLocalization } from '../localization/LocalizationContext';

const { width } = Dimensions.get('window');

// Advanced Expense Tracking System
class ExpenseTracker {
  constructor() {
    this.expenses = [];
    this.categories = [
      { id: 'fuel', name: 'Fuel', icon: '⛽', color: '#FF5722' },
      { id: 'maintenance', name: 'Maintenance', icon: '🔧', color: '#FF9800' },
      { id: 'insurance', name: 'Insurance', icon: '🛡️', color: '#2196F3' },
      { id: 'license', name: 'License/Permits', icon: '📋', color: '#9C27B0' },
      { id: 'food', name: 'Food/Drinks', icon: '🍱', color: '#4CAF50' },
      { id: 'parking', name: 'Parking', icon: '🅿️', color: '#607D8B' },
      { id: 'other', name: 'Other', icon: '📝', color: '#795548' }
    ];
    this.budgets = {};
  }

  async initialize() {
    try {
      const savedData = await AsyncStorage.getItem('expense_tracker_data');
      if (savedData) {
        const data = JSON.parse(savedData);
        this.expenses = data.expenses || [];
        this.budgets = data.budgets || {};
      }
      
      if (this.expenses.length === 0) {
        this.generateSampleData();
      }
      
      this.calculateAnalytics();
    } catch (error) {
      console.error('Expense tracker initialization error:', error);
    }
  }

  generateSampleData() {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now - (i * oneDay));
      
      if (Math.random() > 0.3) {
        const numExpenses = Math.floor(Math.random() * 3) + 1;
        
        for (let j = 0; j < numExpenses; j++) {
          const category = this.categories[Math.floor(Math.random() * this.categories.length)];
          let amount;
          
          switch (category.id) {
            case 'fuel':
              amount = 3000 + (Math.random() * 4000);
              break;
            case 'maintenance':
              amount = Math.random() > 0.8 ? 15000 + (Math.random() * 25000) : 0;
              break;
            case 'food':
              amount = 500 + (Math.random() * 1500);
              break;
            case 'parking':
              amount = 200 + (Math.random() * 800);
              break;
            default:
              amount = 1000 + (Math.random() * 5000);
          }
          
          if (amount > 0) {
            this.expenses.push({
              id: `${date.getTime()}_${j}`,
              date: date.toISOString().split('T')[0],
              timestamp: date.getTime(),
              category: category.id,
              amount: Math.round(amount),
              description: this.getDefaultDescription(category.id),
              location: 'Tokyo',
              paymentMethod: Math.random() > 0.5 ? 'cash' : 'card'
            });
          }
        }
      }
    }

    this.budgets = {
      fuel: 80000,
      maintenance: 30000,
      insurance: 15000,
      food: 20000,
      parking: 10000,
      other: 15000
    };
  }

  getDefaultDescription(categoryId) {
    const descriptions = {
      fuel: 'Gas station fill-up',
      maintenance: 'Vehicle service',
      insurance: 'Monthly insurance',
      food: 'Lunch break',
      parking: 'Parking fee',
      other: 'Miscellaneous expense'
    };
    return descriptions[categoryId] || 'Expense';
  }

  async addExpense(expense) {
    try {
      const newExpense = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        date: new Date().toISOString().split('T')[0],
        ...expense
      };
      
      this.expenses.push(newExpense);
      this.calculateAnalytics();
      await this.saveData();
      
      return newExpense;
    } catch (error) {
      console.error('Add expense error:', error);
      return null;
    }
  }

  calculateAnalytics() {
    const now = Date.now();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    this.monthlyExpenses = {};
    this.categories.forEach(category => {
      this.monthlyExpenses[category.id] = this.expenses
        .filter(expense => {
          const expenseDate = new Date(expense.timestamp);
          return expenseDate.getMonth() === currentMonth && 
                 expenseDate.getFullYear() === currentYear &&
                 expense.category === category.id;
        })
        .reduce((sum, expense) => sum + expense.amount, 0);
    });

    this.dailyExpenses = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now - (i * 24 * 60 * 60 * 1000));
      const dateString = date.toISOString().split('T')[0];
      
      const dailyTotal = this.expenses
        .filter(expense => expense.date === dateString)
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      this.dailyExpenses.push({
        date: dateString,
        total: dailyTotal,
        day: date.getDate()
      });
    }

    this.monthlyTotal = Object.values(this.monthlyExpenses).reduce((sum, amount) => sum + amount, 0);
    this.dailyAverage = this.dailyExpenses.reduce((sum, day) => sum + day.total, 0) / 7;
    
    this.budgetAnalysis = {};
    Object.entries(this.budgets).forEach(([category, budget]) => {
      const spent = this.monthlyExpenses[category] || 0;
      this.budgetAnalysis[category] = {
        budget,
        spent,
        remaining: budget - spent,
        percentage: (spent / budget) * 100
      };
    });
  }

  async saveData() {
    try {
      const data = {
        expenses: this.expenses,
        budgets: this.budgets
      };
      await AsyncStorage.setItem('expense_tracker_data', JSON.stringify(data));
    } catch (error) {
      console.error('Expense tracker data save error:', error);
    }
  }
}

// Expense Tracking Component
const ExpenseTrackingSystem = () => {
  const [expenseTracker] = useState(() => new ExpenseTracker());
  const [expenses, setExpenses] = useState([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState({});
  const [dailyExpenses, setDailyExpenses] = useState([]);
  const [budgetAnalysis, setBudgetAnalysis] = useState({});
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [dailyAverage, setDailyAverage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [newExpense, setNewExpense] = useState({
    category: 'fuel',
    amount: '',
    description: '',
    location: '',
    paymentMethod: 'cash'
  });

  const { t, getCurrentLocaleInfo, formatCurrency } = useLocalization();
  const localeInfo = getCurrentLocaleInfo();

  useEffect(() => {
    initializeExpenseTracker();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const initializeExpenseTracker = async () => {
    setIsLoading(true);
    try {
      await expenseTracker.initialize();
      setExpenses(expenseTracker.expenses);
      setMonthlyExpenses(expenseTracker.monthlyExpenses);
      setDailyExpenses(expenseTracker.dailyExpenses);
      setBudgetAnalysis(expenseTracker.budgetAnalysis);
      setMonthlyTotal(expenseTracker.monthlyTotal);
      setDailyAverage(expenseTracker.dailyAverage);
    } catch (error) {
      console.error('Expense tracker initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExpense = async () => {
    if (!newExpense.amount || !newExpense.description) {
      Alert.alert(
        localeInfo.isJapanese ? 'エラー' : 'Error',
        localeInfo.isJapanese ? '金額と説明を入力してください' : 'Please enter amount and description'
      );
      return;
    }

    try {
      const expense = await expenseTracker.addExpense({
        ...newExpense,
        amount: parseFloat(newExpense.amount)
      });

      if (expense) {
        setExpenses([...expenseTracker.expenses]);
        setMonthlyExpenses({...expenseTracker.monthlyExpenses});
        setDailyExpenses([...expenseTracker.dailyExpenses]);
        setBudgetAnalysis({...expenseTracker.budgetAnalysis});
        setMonthlyTotal(expenseTracker.monthlyTotal);
        setDailyAverage(expenseTracker.dailyAverage);
        
        setNewExpense({
          category: 'fuel',
          amount: '',
          description: '',
          location: '',
          paymentMethod: 'cash'
        });
        setShowAddExpenseModal(false);
        
        Alert.alert(
          localeInfo.isJapanese ? '成功' : 'Success',
          localeInfo.isJapanese ? '支出を追加しました' : 'Expense added successfully'
        );
      }
    } catch (error) {
      console.error('Add expense error:', error);
    }
  };

  const getCategoryExpenseData = () => {
    return Object.entries(monthlyExpenses)
      .filter(([category, amount]) => amount > 0)
      .map(([category, amount]) => {
        const categoryInfo = expenseTracker.categories.find(cat => cat.id === category);
        return {
          name: categoryInfo?.name || category,
          population: amount,
          color: categoryInfo?.color || '#999',
          legendFontColor: '#333',
          legendFontSize: 12
        };
      });
  };

  const getDailyExpenseData = () => {
    return {
      labels: dailyExpenses.map(day => day.day.toString()),
      datasets: [{
        data: dailyExpenses.map(day => day.total)
      }]
    };
  };

  const getBudgetStatusColor = (percentage) => {
    if (percentage >= 100) return '#F44336';
    if (percentage >= 80) return '#FF9800';
    if (percentage >= 60) return '#FFC107';
    return '#4CAF50';
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          {localeInfo.isJapanese ? '支出データ読み込み中...' : 'Loading expense data...'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#4CAF50', '#388E3C']} style={styles.header}>
        <Animated.View style={[styles.headerContent, { opacity: fadeAnim }]}>
          <Text style={styles.headerIcon}>💰</Text>
          <Text style={styles.headerTitle}>
            {localeInfo.isJapanese ? '支出管理システム' : 'Expense Tracking System'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {localeInfo.isJapanese 
              ? 'タクシー運営費用の詳細分析と予算管理'
              : 'Detailed analysis and budget management for taxi operations'
            }
          </Text>
        </Animated.View>
      </LinearGradient>

      <View style={styles.summaryContainer}>
        <LinearGradient colors={['#ffffff', '#f8f9fa']} style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            📊 {localeInfo.isJapanese ? '今月の支出概要' : 'Monthly Expense Summary'}
          </Text>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatCurrency(monthlyTotal)}</Text>
              <Text style={styles.statLabel}>
                {localeInfo.isJapanese ? '今月の総支出' : 'Total This Month'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatCurrency(dailyAverage)}</Text>
              <Text style={styles.statLabel}>
                {localeInfo.isJapanese ? '1日平均' : 'Daily Average'}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            {localeInfo.isJapanese ? '概要' : 'Overview'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'budget' && styles.activeTab]}
          onPress={() => setActiveTab('budget')}
        >
          <Text style={[styles.tabText, activeTab === 'budget' && styles.activeTabText]}>
            {localeInfo.isJapanese ? '予算' : 'Budget'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'expenses' && styles.activeTab]}
          onPress={() => setActiveTab('expenses')}
        >
          <Text style={[styles.tabText, activeTab === 'expenses' && styles.activeTabText]}>
            {localeInfo.isJapanese ? '支出履歴' : 'Expenses'}
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'overview' && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              📈 {localeInfo.isJapanese ? 'カテゴリ別支出' : 'Expenses by Category'}
            </Text>
            
            {getCategoryExpenseData().length > 0 && (
              <View style={styles.chartContainer}>
                <PieChart
                  data={getCategoryExpenseData()}
                  width={width - 40}
                  height={220}
                  chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                />
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              📊 {localeInfo.isJapanese ? '過去7日間の支出' : 'Last 7 Days Expenses'}
            </Text>
            
            {dailyExpenses.length > 0 && (
              <View style={styles.chartContainer}>
                <BarChart
                  data={getDailyExpenseData()}
                  width={width - 40}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  style={styles.chart}
                />
              </View>
            )}
          </View>
        </Animated.View>
      )}

      {activeTab === 'budget' && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              🎯 {localeInfo.isJapanese ? '予算vs実績' : 'Budget vs Actual'}
            </Text>
            
            {Object.entries(budgetAnalysis).map(([category, analysis]) => {
              const categoryInfo = expenseTracker.categories.find(cat => cat.id === category);
              return (
                <View key={category} style={styles.budgetCard}>
                  <View style={styles.budgetHeader}>
                    <Text style={styles.budgetIcon}>{categoryInfo?.icon}</Text>
                    <Text style={styles.budgetCategory}>{categoryInfo?.name}</Text>
                    <Text style={[styles.budgetPercentage, {
                      color: getBudgetStatusColor(analysis.percentage)
                    }]}>
                      {Math.round(analysis.percentage)}%
                    </Text>
                  </View>
                  
                  <View style={styles.progressBarContainer}>
                    <View 
                      style={[
                        styles.progressBar, 
                        { 
                          width: `${Math.min(100, analysis.percentage)}%`,
                          backgroundColor: getBudgetStatusColor(analysis.percentage)
                        }
                      ]} 
                    />
                  </View>
                  
                  <View style={styles.budgetDetails}>
                    <Text style={styles.budgetSpent}>
                      {localeInfo.isJapanese ? '使用' : 'Spent'}: {formatCurrency(analysis.spent)}
                    </Text>
                    <Text style={styles.budgetRemaining}>
                      {localeInfo.isJapanese ? '残り' : 'Remaining'}: {formatCurrency(analysis.remaining)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </Animated.View>
      )}

      {activeTab === 'expenses' && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                📝 {localeInfo.isJapanese ? '最近の支出' : 'Recent Expenses'}
              </Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddExpenseModal(true)}
              >
                <Ionicons name="add" size={20} color="white" />
                <Text style={styles.addButtonText}>
                  {localeInfo.isJapanese ? '追加' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {expenses.length > 0 ? (
              expenses
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, 15)
                .map((expense, index) => {
                  const categoryInfo = expenseTracker.categories.find(cat => cat.id === expense.category);
                  return (
                    <View key={expense.id || index} style={styles.expenseCard}>
                      <View style={styles.expenseHeader}>
                        <Text style={styles.expenseIcon}>{categoryInfo?.icon}</Text>
                        <View style={styles.expenseInfo}>
                          <Text style={styles.expenseDescription}>{expense.description}</Text>
                          <Text style={styles.expenseCategory}>{categoryInfo?.name}</Text>
                        </View>
                        <Text style={styles.expenseAmount}>{formatCurrency(expense.amount)}</Text>
                      </View>
                      <Text style={styles.expenseDate}>
                        {new Date(expense.timestamp).toLocaleDateString()}
                      </Text>
                    </View>
                  );
                })
            ) : (
              <Text style={styles.noDataText}>
                {localeInfo.isJapanese ? '支出履歴がありません' : 'No expenses recorded'}
              </Text>
            )}
          </View>
        </Animated.View>
      )}

      <Modal
        visible={showAddExpenseModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddExpenseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {localeInfo.isJapanese ? '新しい支出を追加' : 'Add New Expense'}
            </Text>
            
            <Text style={styles.inputLabel}>
              {localeInfo.isJapanese ? 'カテゴリ' : 'Category'}
            </Text>
            <ScrollView horizontal style={styles.categorySelector}>
              {expenseTracker.categories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryOption,
                    newExpense.category === category.id && styles.selectedCategory
                  ]}
                  onPress={() => setNewExpense({...newExpense, category: category.id})}
                >
                  <Text style={styles.categoryOptionIcon}>{category.icon}</Text>
                  <Text style={styles.categoryOptionText}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TextInput
              style={styles.input}
              placeholder={localeInfo.isJapanese ? '金額 (円)' : 'Amount (¥)'}
              value={newExpense.amount}
              onChangeText={(text) => setNewExpense({...newExpense, amount: text})}
              keyboardType="numeric"
            />
            
            <TextInput
              style={styles.input}
              placeholder={localeInfo.isJapanese ? '説明' : 'Description'}
              value={newExpense.description}
              onChangeText={(text) => setNewExpense({...newExpense, description: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder={localeInfo.isJapanese ? '場所 (任意)' : 'Location (optional)'}
              value={newExpense.location}
              onChangeText={(text) => setNewExpense({...newExpense, location: text})}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddExpenseModal(false)}
              >
                <Text style={styles.cancelButtonText}>
                  {localeInfo.isJapanese ? 'キャンセル' : 'Cancel'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddExpense}
              >
                <Text style={styles.saveButtonText}>
                  {localeInfo.isJapanese ? '保存' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 30,
    paddingTop: 50,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  summaryContainer: {
    margin: 20,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryCard: {
    padding: 25,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#4CAF50',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
  },
  section: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  budgetCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  budgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  budgetIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  budgetCategory: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  budgetPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  budgetDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetSpent: {
    fontSize: 14,
    color: '#333',
  },
  budgetRemaining: {
    fontSize: 14,
    color: '#666',
  },
  expenseCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  expenseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  expenseIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  expenseCategory: {
    fontSize: 12,
    color: '#666',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  expenseDate: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 25,
    borderRadius: 20,
    maxHeight: '80%',
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  categorySelector: {
    marginBottom: 20,
  },
  categoryOption: {
    alignItems: 'center',
    padding: 10,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    minWidth: 80,
  },
  selectedCategory: {
    backgroundColor: '#4CAF50',
  },
  categoryOptionIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  categoryOptionText: {
    fontSize: 10,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noDataText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 20,
  },
});

export default ExpenseTrackingSystem;