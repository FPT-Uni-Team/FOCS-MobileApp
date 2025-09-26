import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput as RNTextInput,
} from 'react-native';
import { Button, Text, HelperText } from 'react-native-paper';
import Icon from '../../common/Icon/Icon';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '../../../utils/validationSchemas';

interface LoginFormProps {
  loading: boolean;
  error: string | null;
  onSubmit: (data: LoginFormData) => void;
  onBackPress: () => void;
  onRegisterPress: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  loading,
  error,
  onSubmit,
  onBackPress,
  onRegisterPress,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#2c3e50" />
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Welcome back! Glad</Text>
        <Text style={styles.title}>to see you, Again!</Text>
      </View>

      <View style={styles.formContainer}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <RNTextInput
                placeholder="Enter your email"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[styles.input, errors.email && styles.inputError]}
                editable={!loading}
                placeholderTextColor="#6c757d"
              />
              <HelperText type="error" visible={!!errors.email}>
                {errors.email?.message}
              </HelperText>
            </View>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <RNTextInput
                placeholder="Enter your password"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                secureTextEntry={!showPassword}
                style={[styles.input, errors.password && styles.inputError]}
                editable={!loading}
                placeholderTextColor="#6c757d"
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                style={styles.passwordToggle}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                disabled={loading}
              >
                <Icon
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#6c757d"
                />
              </TouchableOpacity>
              <HelperText type="error" visible={!!errors.password}>
                {errors.password?.message}
              </HelperText>
            </View>
          )}
        />

        <TouchableOpacity style={styles.forgotContainer}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          disabled={loading}
          style={styles.loginButton}
          labelStyle={styles.loginButtonText}
          contentStyle={styles.loginButtonContent}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.socialContainer}>
          <Text style={styles.socialText}>Or Login with</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#1877f2' }]}>
              <Text style={[styles.socialIcon, { color: 'white' }]}>f</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#ea4335' }]}>
              <Text style={[styles.socialIcon, { color: 'white' }]}>G</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#000000' }]}>
              <Text style={[styles.socialIcon, { color: 'white' }]}>A</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={onRegisterPress}>
            <Text style={styles.registerLink}>Register Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    alignSelf: 'flex-start',
  },
  titleContainer: {
    marginBottom: 40,
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    lineHeight: 36,
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 12,
    zIndex: 1,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    height: 56,
    fontSize: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  inputError: {
    borderColor: '#d32f2f',
    backgroundColor: '#fff5f5',
  },
  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  forgotText: {
    color: '#6c757d',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#2c3e50',
    borderRadius: 8,
    marginBottom: 20,
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
  },
  socialContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  socialText: {
    color: '#6c757d',
    fontSize: 14,
    marginBottom: 15,
  },
  socialButtons: {
    flexDirection: 'row',
  },
  socialButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginHorizontal: 7.5,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  registerText: {
    color: '#6c757d',
    fontSize: 14,
  },
  registerLink: {
    color: '#00b894',
    fontSize: 14,
    fontWeight: '600',
  },
  passwordToggle: {
    position: 'absolute',
    right: 0,
    height: 56,
    justifyContent: 'center',
  },

});

export default LoginForm;
 