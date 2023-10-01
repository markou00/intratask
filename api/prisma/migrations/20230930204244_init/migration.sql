BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Ticket] (
    [id] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL,
    [subject] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Ticket_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[DescriptionVector] (
    [id] INT NOT NULL IDENTITY(1,1),
    [ticketId] INT NOT NULL,
    [vectorValue] FLOAT(53) NOT NULL,
    CONSTRAINT [DescriptionVector_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [DescriptionVector_ticketId_id_key] UNIQUE NONCLUSTERED ([ticketId],[id])
);

-- CreateTable
CREATE TABLE [dbo].[Tag] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [ticketId] INT NOT NULL,
    CONSTRAINT [Tag_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[DescriptionVector] ADD CONSTRAINT [DescriptionVector_ticketId_fkey] FOREIGN KEY ([ticketId]) REFERENCES [dbo].[Ticket]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Tag] ADD CONSTRAINT [Tag_ticketId_fkey] FOREIGN KEY ([ticketId]) REFERENCES [dbo].[Ticket]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
