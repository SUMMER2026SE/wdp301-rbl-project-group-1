$projectId = "edura-495704"
$projectNumber = "580325392054"
$poolName = "gitlab-pool"
$providerName = "gitlab-provider"
$saName = "gitlab-ci-deploy"
$saEmail = "${saName}@${projectId}.iam.gserviceaccount.com"

Write-Host "Enabling APIs..."
gcloud services enable iamcredentials.googleapis.com cloudresourcemanager.googleapis.com

Write-Host "Creating Service Account..."
gcloud iam service-accounts create $saName --display-name="GitLab CI Deploy SA"

Write-Host "Granting Roles..."
gcloud projects add-iam-policy-binding $projectId --member="serviceAccount:${saEmail}" --role="roles/run.admin"
gcloud projects add-iam-policy-binding $projectId --member="serviceAccount:${saEmail}" --role="roles/artifactregistry.writer"
gcloud projects add-iam-policy-binding $projectId --member="serviceAccount:${saEmail}" --role="roles/iam.serviceAccountUser"

Write-Host "Creating Workload Identity Pool..."
gcloud iam workload-identity-pools create $poolName --project=$projectId --location="global" --display-name="GitLab CI Pool"

Write-Host "Creating Workload Identity Provider..."
gcloud iam workload-identity-pools providers create-oidc $providerName --project=$projectId --location="global" --workload-identity-pool=$poolName --display-name="GitLab CI Provider" --issuer-uri="https://gitlab.com" --allowed-audiences="https://gitlab.com" --attribute-mapping="google.subject=assertion.project_path,attribute.project_path=assertion.project_path,attribute.ref=assertion.ref"

Write-Host "Binding SA to WIF Pool..."
$member = "principalSet://iam.googleapis.com/projects/${projectNumber}/locations/global/workloadIdentityPools/${poolName}/attribute.project_path/edura/edura-model"
gcloud iam service-accounts add-iam-policy-binding $saEmail --project=$projectId --role="roles/iam.workloadIdentityUser" --member=$member

Write-Host "Setup Completed."
