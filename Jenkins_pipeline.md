pipeline {
  agent any

  stages {

    stage('Checkout') {
      steps {
        git branch: 'jenkins', url: 'https://github.com/sharathbodige/job_portal_final.git'
      }
    }

    stage('Build & Deploy') {
      steps {
        sh '''
          cd job_portal
         # Stop & remove old containers of this project only
          docker-compose down --remove-orphans || true

          # Remove containers with same names if still exist
          docker rm -f job_portal_app2 job_portal_db2 job_portal_redis2 2>/dev/null || true

          # Rebuild and start fresh
          docker-compose build --no-cache
          docker-compose up -d
        '''
      }
    }
  }
}
