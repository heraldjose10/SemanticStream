import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config():
    """Configurations for Flask application"""
    SECRET_KEY = os.environ.get('SECRET_KEY')
    DEBUG = False


class DevelopmentConfig(Config):
    """Development configurations for Flask application"""
    DEBUG = True


class TestingConfig(Config):
    """Testing configurations for Flask application"""
    DEBUG = True
    TESTING = True


class ProductionConfig(Config):
    """Production configurations for Flask application"""
    DEBUG = False


configs = {
    'development': DevelopmentConfig,
    'test': TestingConfig,
    'production': ProductionConfig
}