pipeline {
    agent any

    stages {
//         stage('Checkout') {
//             steps {
//                 git branch: 'main', url: 'https://github.com/LucGen95/catalojogo.git'
//             }
//         }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'docker build -t catalojogo-backend .'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'docker build -t catalojogo-frontend .'
                }
            }
        }

        stage('Build & Deploy Stack') {
            steps {
                sh 'docker compose up -d --build'
            }
        }

        stage('Health Check') {
            steps {
                sh 'curl -f http://localhost:8080/actuator/health || exit 1'
            }
        }
    }

    post {
        success {
            echo '✅ Deploy concluído com sucesso!'
        }
        failure {
            echo '❌ Falha no pipeline.'
        }
    }
}
