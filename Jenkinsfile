pipeline {
    agent {
        // Usamos una imagen de Maven con Java 17, similar a la que usaba tu Dockerfile original
        docker {
            image 'maven:3.9.6-eclipse-temurin-17'
            args '-v /root/.m2:/root/.m2' // Opcional: para cachear dependencias
        }
    }

    environment {
        // ID de la credencial guardada en Jenkins (debe coincidir con la configuración)
        DOCKER_CREDENTIALS_ID = 'finalISA'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test') {
            steps {
                // Ejecutamos los tests unitarios
                sh 'mvn clean verify'
            }
        }

        stage('Publish to Docker Hub') {
            steps {
                // Inyectamos usuario y contraseña de las credenciales de Jenkins en variables de entorno
                withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_REGISTRY_USER', passwordVariable: 'DOCKER_REGISTRY_PWD')]) {
                    script {
                        // Jib usa estas variables automáticamente gracias a la config del pom.xml
                        sh 'mvn jib:build -DskipTests'
                    }
                }
            }
        }
    }
}